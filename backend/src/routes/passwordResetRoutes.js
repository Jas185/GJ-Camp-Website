const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const User = require('../models/User');
const { sendPasswordResetEmail } = require('../config/email');
const { ADMIN_ROLES } = require('../constants/roles');

// @route   GET /api/password-reset/pending
// @desc    Récupérer toutes les demandes de réinitialisation en attente
router.get('/pending', auth, authorize(...ADMIN_ROLES), async (req, res) => {
  try {
    const pendingResets = await User.find({
      resetPasswordRequestedAt: { $ne: null },
      resetPasswordApproved: false,
      resetPasswordExpires: { $gt: Date.now() }
    }).select('firstName lastName email resetPasswordRequestedAt');

    console.log(`📋 ${pendingResets.length} demandes de réinitialisation en attente`);
    
    res.json({
      count: pendingResets.length,
      requests: pendingResets
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des demandes' });
  }
});

// @route   POST /api/password-reset/approve/:userId
// @desc    Approuver une demande de réinitialisation et envoyer le lien
router.post('/approve/:userId', auth, authorize(...ADMIN_ROLES), async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user.userId;

    const user = await User.findOne({
      _id: userId,
      resetPasswordRequestedAt: { $ne: null },
      resetPasswordApproved: false,
      resetPasswordExpires: { $gt: Date.now() }
    }).select('+resetPasswordToken');

    if (!user) {
      return res.status(404).json({ 
        message: 'Demande introuvable ou expirée' 
      });
    }

    // Marquer comme approuvé
    user.resetPasswordApproved = true;
    user.resetPasswordApprovedBy = adminId;
    await user.save({ validateBeforeSave: false });

    // Récupérer le token en clair (le re-générer à partir du hash n'est pas possible)
    // On doit regénérer un nouveau token
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    user.resetPasswordExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h
    await user.save({ validateBeforeSave: false });

    // Envoyer l'email avec le lien de réinitialisation
    await sendPasswordResetEmail(user.email, user.firstName, resetToken);

    console.log(`✅ Demande de réinitialisation approuvée pour ${user.email} par admin ${adminId}`);
    
    res.json({
      message: 'Demande approuvée et email de réinitialisation envoyé',
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'approbation:', error);
    res.status(500).json({ message: 'Erreur lors de l\'approbation de la demande' });
  }
});

// @route   DELETE /api/password-reset/reject/:userId
// @desc    Rejeter une demande de réinitialisation
router.delete('/reject/:userId', auth, authorize(...ADMIN_ROLES), async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    // Supprimer la demande
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.resetPasswordRequestedAt = undefined;
    user.resetPasswordApproved = false;
    user.resetPasswordApprovedBy = undefined;
    
    await user.save({ validateBeforeSave: false });

    console.log(`❌ Demande de réinitialisation rejetée pour ${user.email}`);
    
    res.json({
      message: 'Demande de réinitialisation rejetée'
    });
  } catch (error) {
    console.error('Erreur lors du rejet:', error);
    res.status(500).json({ message: 'Erreur lors du rejet de la demande' });
  }
});

module.exports = router;
