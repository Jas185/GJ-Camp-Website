const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireAdminRole } = require('../middleware/roleCheck');
const Campus = require('../models/Campus');
const Payout = require('../models/Payout');
const payoutService = require('../services/payoutService');

// Toutes les routes nécessitent l'authentification admin
router.use(auth, requireAdminRole);

/**
 * GET /api/payouts - Lister tous les payouts
 */
router.get('/', async (req, res) => {
  try {
    const { campus, status, page = 1, limit = 20 } = req.query;
    const filters = {};

    if (campus) filters.campus = campus;
    if (status) filters.status = status;

    const payouts = await Payout.find(filters)
      .populate('registration', 'firstName lastName email refuge amountPaid')
      .populate('processedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Payout.countDocuments(filters);

    res.json({
      payouts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error('❌ Erreur récupération payouts:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/**
 * GET /api/payouts/statistics - Statistiques de redistribution
 */
router.get('/statistics', async (req, res) => {
  try {
    const { campus, startDate, endDate } = req.query;
    const filters = {};

    if (campus) filters.campus = campus;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const stats = await payoutService.getStatistics(filters);

    res.json(stats);
  } catch (error) {
    console.error('❌ Erreur calcul statistiques:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/**
 * POST /api/payouts/create/:registrationId - Créer un payout pour une inscription
 */
router.post('/create/:registrationId', async (req, res) => {
  try {
    const { registrationId } = req.params;
    const processedBy = req.user.userId;

    const payout = await payoutService.createPayoutForRegistration(registrationId, processedBy);

    res.status(201).json({
      message: 'Payout créé avec succès',
      payout,
    });
  } catch (error) {
    console.error('❌ Erreur création payout:', error);
    res.status(400).json({ message: error.message || 'Erreur lors de la création du payout' });
  }
});

/**
 * POST /api/payouts/execute - Exécuter les payouts en attente
 */
router.post('/execute', async (req, res) => {
  try {
    const { limit = 50 } = req.body;

    const result = await payoutService.executePendingPayouts(limit);

    res.json({
      message: `Redistribution terminée: ${result.success} succès, ${result.failed} échecs`,
      ...result,
    });
  } catch (error) {
    console.error('❌ Erreur exécution payouts:', error);
    res.status(500).json({ message: error.message || 'Erreur lors de l\'exécution des payouts' });
  }
});

/**
 * GET /api/payouts/:id/status - Vérifier le statut d'un payout sur PayPal
 */
router.get('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;

    const payout = await payoutService.getPayoutStatus(id);

    res.json({
      message: 'Statut mis à jour',
      payout,
    });
  } catch (error) {
    console.error('❌ Erreur vérification statut:', error);
    res.status(500).json({ message: error.message || 'Erreur lors de la vérification du statut' });
  }
});

/**
 * PATCH /api/payouts/:id/cancel - Annuler un payout en attente
 */
router.patch('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;

    const payout = await Payout.findById(id);

    if (!payout) {
      return res.status(404).json({ message: 'Payout introuvable' });
    }

    if (payout.status !== 'pending') {
      return res.status(400).json({ message: 'Seuls les payouts en attente peuvent être annulés' });
    }

    payout.status = 'cancelled';
    payout.processedBy = req.user.userId;
    payout.processedAt = new Date();
    await payout.save();

    res.json({
      message: 'Payout annulé avec succès',
      payout,
    });
  } catch (error) {
    console.error('❌ Erreur annulation payout:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
