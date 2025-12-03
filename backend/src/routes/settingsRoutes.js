/**
 * Routes API pour la gestion des paramètres du site
 * Accessible uniquement aux administrateurs
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const logoUpload = require('../middleware/logoUpload');
const settingsController = require('../controllers/settingsController');

// Middleware pour vérifier le rôle admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Accès refusé. Seuls les administrateurs peuvent modifier les paramètres.' 
    });
  }
  next();
};

// Routes protégées (admin uniquement)
router.get('/', settingsController.getSettings); // Public pour charger le logo
router.put('/', auth, requireAdmin, settingsController.updateSettings);
router.post('/reset', auth, requireAdmin, settingsController.resetSettings);
router.post('/upload-logo', auth, requireAdmin, logoUpload, settingsController.uploadLogo);

module.exports = router;
