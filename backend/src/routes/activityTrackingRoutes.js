const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const requireVerifiedEmail = require('../middleware/requireVerifiedEmail');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { ADMIN_ROLES } = require('../constants/roles');

// 📊 Récupérer les statistiques d'inscription par activité optionnelle
router.get('/statistics', auth, requireVerifiedEmail, authorize(...ADMIN_ROLES), async (req, res) => {
  try {
    // Récupérer toutes les activités optionnelles
    const activities = await Activity.find({ type: 'optionnelle', actif: true })
      .populate('referent', 'firstName lastName email')
      .sort({ jour: 1, heureDebut: 1 });

    // Pour chaque activité, compter les inscrits
    const statistiques = await Promise.all(activities.map(async (activity) => {
      // Compter le nombre d'utilisateurs ayant sélectionné cette activité
      const inscritCount = await User.countDocuments({
        selectedActivities: activity._id
      });

      // Récupérer la liste des utilisateurs inscrits avec leurs infos
      const inscrits = await User.find({
        selectedActivities: activity._id
      }).select('firstName lastName email phone refuge sex dateOfBirth');

      return {
        activity: {
          _id: activity._id,
          titre: activity.titre,
          description: activity.description,
          jour: activity.jour,
          heureDebut: activity.heureDebut,
          heureFin: activity.heureFin,
          image: activity.image,
          referent: activity.referent
        },
        inscritCount,
        inscrits
      };
    }));

    console.log(`📊 Statistiques récupérées pour ${statistiques.length} activités`);
    res.json(statistiques);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
});

// 📋 Récupérer les inscrits d'une activité spécifique
router.get('/:activityId/participants', auth, requireVerifiedEmail, authorize(...ADMIN_ROLES), async (req, res) => {
  try {
    const { activityId } = req.params;

    // Vérifier que l'activité existe
    const activity = await Activity.findById(activityId).populate('referent', 'firstName lastName email');
    if (!activity) {
      return res.status(404).json({ message: 'Activité non trouvée' });
    }

    // Récupérer les participants
    const participants = await User.find({
      selectedActivities: activityId
    }).select('firstName lastName email phone refuge sex dateOfBirth selectedActivities');

    console.log(`📋 ${participants.length} participants pour l'activité "${activity.titre}"`);
    res.json({
      activity,
      participantCount: participants.length,
      participants
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des participants:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des participants' });
  }
});

// 📊 Exporter les participants d'une activité (format CSV)
router.get('/:activityId/export', auth, requireVerifiedEmail, authorize(...ADMIN_ROLES), async (req, res) => {
  try {
    const { activityId } = req.params;

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activité non trouvée' });
    }

    const participants = await User.find({
      selectedActivities: activityId
    }).select('firstName lastName email phone refuge sex dateOfBirth');

    // Créer le CSV
    const csvHeader = 'Prénom,Nom,Email,Téléphone,Refuge,Sexe,Date de naissance\n';
    const csvRows = participants.map(p => {
      const dob = p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString('fr-FR') : '';
      return `"${p.firstName}","${p.lastName}","${p.email}","${p.phone}","${p.refuge}","${p.sex}","${dob}"`;
    }).join('\n');

    const csv = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="participants_${activity.titre.replace(/\s+/g, '_')}.csv"`);
    res.send('\uFEFF' + csv); // BOM pour Excel

    console.log(`📊 Export CSV pour l'activité "${activity.titre}": ${participants.length} participants`);
  } catch (error) {
    console.error('❌ Erreur lors de l\'export:', error);
    res.status(500).json({ message: 'Erreur lors de l\'export' });
  }
});

module.exports = router;
