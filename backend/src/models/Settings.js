/**
 * Modèle Settings - Paramètres du site
 * Stocke tous les paramètres de la charte graphique modifiables par les admins
 */

const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  settings: {
    type: Object,
    required: true,
    default: {}
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
settingsSchema.index({ updatedAt: -1 });

// Méthode pour récupérer un paramètre spécifique
settingsSchema.methods.getSetting = function(key) {
  return this.settings[key];
};

// Méthode pour définir un paramètre spécifique
settingsSchema.methods.setSetting = function(key, value) {
  this.settings[key] = value;
  this.markModified('settings'); // Important pour que Mongoose détecte le changement
};

module.exports = mongoose.model('Settings', settingsSchema);
