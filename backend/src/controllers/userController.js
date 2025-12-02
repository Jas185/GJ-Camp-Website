const mongoose = require('mongoose');
const User = require('../models/User');
const RoleAudit = require('../models/RoleAudit');
const { ROLES } = require('../constants/roles');

const sanitizeUser = (user) => {
  if (!user) return null;
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.emailVerificationToken;
  delete obj.emailVerificationExpires;
  return obj;
};

exports.getRoleOptions = (req, res) => {
  res.status(200).json({ roles: ROLES });
};

exports.listUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    const filters = {};

    if (role && ROLES.includes(role)) {
      filters.role = role;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      filters.$or = [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
      ];
    }

    const users = await User.find(filters)
      .select('-password -emailVerificationToken -emailVerificationExpires')
      .sort({ createdAt: -1 });

    res.status(200).json({ users });
  } catch (error) {
    console.error('❌ Erreur lors du listing des utilisateurs:', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération des utilisateurs' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Identifiant utilisateur invalide' });
    }

    const user = await User.findById(req.params.id)
      .select('-password -emailVerificationToken -emailVerificationExpires');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la récupération de l\'utilisateur' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role, commentaire } = req.body;
    const targetUserId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ message: 'Identifiant utilisateur invalide' });
    }

    if (!role || !ROLES.includes(role)) {
      return res.status(400).json({ message: 'Rôle invalide' });
    }

    if (targetUserId === req.user.userId) {
      return res.status(400).json({ message: 'Vous ne pouvez pas modifier votre propre rôle' });
    }

    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    const ancienRole = targetUser.role;

    if (ancienRole === role) {
      return res.status(200).json({ message: 'Le rôle est déjà défini sur cette valeur', user: sanitizeUser(targetUser) });
    }

    targetUser.role = role;
    await targetUser.save();

    const normalizedOldRole = ancienRole === 'user' ? 'utilisateur' : ancienRole;

    await RoleAudit.create({
      acteur: req.user.userId,
      cible: targetUser._id,
      ancienRole: normalizedOldRole,
      nouveauRole: role,
      commentaire: commentaire || '',
    });

    res.status(200).json({
      message: 'Rôle utilisateur mis à jour avec succès',
      user: sanitizeUser(targetUser),
    });
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du rôle:', error);
    res.status(500).json({ message: 'Impossible de mettre à jour le rôle pour le moment' });
  }
};

exports.adminUpdateUserProfile = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ message: 'Identifiant utilisateur invalide' });
    }

    const {
      firstName,
      lastName,
      churchWebsite,
      phoneNumber,
      bio,
      ministryRole,
      socialLinks,
    } = req.body;

    const updatePayload = {
      ...(firstName !== undefined && { firstName }),
      ...(lastName !== undefined && { lastName }),
      ...(churchWebsite !== undefined && { churchWebsite }),
      ...(phoneNumber !== undefined && { phoneNumber }),
      ...(bio !== undefined && { bio }),
      ...(ministryRole !== undefined && { ministryRole }),
    };

    if (socialLinks && typeof socialLinks === 'object') {
      const cleanedLinks = Object.entries(socialLinks).reduce((acc, [key, value]) => {
        if (typeof value === 'string' && value.trim() !== '') {
          acc[key] = value.trim();
        }
        return acc;
      }, {});
      updatePayload.socialLinks = cleanedLinks;
    }

    const updatedUser = await User.findByIdAndUpdate(targetUserId, updatePayload, {
      new: true,
      runValidators: true,
      context: 'query',
    }).select('-password -emailVerificationToken -emailVerificationExpires');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    res.status(200).json({
      message: 'Profil utilisateur mis à jour',
      user: sanitizeUser(updatedUser),
    });
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du profil administrateur:', error);
    res.status(500).json({ message: 'Impossible de mettre à jour ce profil pour le moment' });
  }
};

exports.listRoleAudits = async (req, res) => {
  try {
    const audits = await RoleAudit.find()
      .populate('acteur', 'firstName lastName email role')
      .populate('cible', 'firstName lastName email role')
      .sort({ creeLe: -1 })
      .limit(100);

    res.status(200).json({ audits });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des audits:', error);
    res.status(500).json({ message: 'Impossible de récupérer l\'historique des rôles' });
  }
};

exports.adminConfirmEmail = async (req, res) => {
  try {
    const targetUserId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ message: 'Identifiant utilisateur invalide' });
    }

    const targetUser = await User.findById(targetUserId).select(
      '-password +emailVerificationToken +emailVerificationExpires'
    );

    if (!targetUser) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    if (targetUser.isEmailVerified) {
      return res.status(200).json({
        message: 'Cet email est déjà confirmé.',
        user: sanitizeUser(targetUser),
      });
    }

    targetUser.isEmailVerified = true;
    targetUser.emailVerifiedAt = new Date();
    targetUser.emailVerificationToken = undefined;
    targetUser.emailVerificationExpires = undefined;

    await targetUser.save({ validateBeforeSave: false });

    res.status(200).json({
      message: 'Email confirmé manuellement avec succès.',
      user: sanitizeUser(targetUser),
    });
  } catch (error) {
    console.error('❌ Erreur lors de la confirmation manuelle de l\'email:', error);
    res.status(500).json({ message: 'Impossible de confirmer cet email pour le moment.' });
  }
};

exports.updateUserPermissions = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const { canCreatePost } = req.body;

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ message: 'Identifiant utilisateur invalide' });
    }

    if (typeof canCreatePost !== 'boolean') {
      return res.status(400).json({ message: 'La valeur de canCreatePost doit être un booléen' });
    }

    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    targetUser.canCreatePost = canCreatePost;
    await targetUser.save();

    res.status(200).json({
      message: `Permission de création de posts ${canCreatePost ? 'accordée' : 'révoquée'} avec succès.`,
      user: sanitizeUser(targetUser),
    });
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour des permissions:', error);
    res.status(500).json({ message: 'Impossible de mettre à jour les permissions pour le moment.' });
  }
};

// Désactiver un compte utilisateur
exports.deactivateUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ message: 'Identifiant utilisateur invalide' });
    }

    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    if (!targetUser.isActive) {
      return res.status(400).json({ message: 'Ce compte est déjà désactivé' });
    }

    targetUser.isActive = false;
    targetUser.deactivatedAt = new Date();
    targetUser.deactivatedBy = req.user.userId;
    targetUser.deactivationReason = reason || 'Aucune raison fournie';
    await targetUser.save();

    res.status(200).json({
      message: 'Compte utilisateur désactivé avec succès',
      user: sanitizeUser(targetUser),
    });
  } catch (error) {
    console.error('❌ Erreur lors de la désactivation:', error);
    res.status(500).json({ message: 'Impossible de désactiver ce compte pour le moment.' });
  }
};

// Activer un compte utilisateur
exports.activateUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ message: 'Identifiant utilisateur invalide' });
    }

    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    if (targetUser.isActive) {
      return res.status(400).json({ message: 'Ce compte est déjà actif' });
    }

    targetUser.isActive = true;
    targetUser.deactivatedAt = null;
    targetUser.deactivatedBy = null;
    targetUser.deactivationReason = null;
    await targetUser.save();

    res.status(200).json({
      message: 'Compte utilisateur activé avec succès',
      user: sanitizeUser(targetUser),
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'activation:', error);
    res.status(500).json({ message: 'Impossible d\'activer ce compte pour le moment.' });
  }
};

// Supprimer un compte utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ message: 'Identifiant utilisateur invalide' });
    }

    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    // Empêcher la suppression de son propre compte
    if (targetUserId === req.user.userId) {
      return res.status(403).json({ message: 'Vous ne pouvez pas supprimer votre propre compte' });
    }

    await User.findByIdAndDelete(targetUserId);

    res.status(200).json({
      message: 'Compte utilisateur supprimé avec succès',
    });
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    res.status(500).json({ message: 'Impossible de supprimer ce compte pour le moment.' });
  }
};

