const mongoose = require('mongoose');

const consentLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  consentType: {
    type: String,
    required: true,
    enum: [
      'inscription', 
      'traitement_donnees', 
      'marketing', 
      'cookies', 
      'donnees_sante',
      'modification_consentement',
      'retrait_consentement'
    ]
  },
  consentGiven: {
    type: Boolean,
    required: true
  },
  consentVersion: {
    type: String,
    required: true,
    default: '1.0'
  },
  ipAddress: {
    type: String,
    required: false
  },
  userAgent: {
    type: String,
    required: false
  },
  metadata: {
    type: Map,
    of: String,
    default: () => ({})
  },
  consentDate: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true
});

// Index pour rechercher rapidement les consentements d'un utilisateur
consentLogSchema.index({ user: 1, consentType: 1, consentDate: -1 });

// Méthode statique pour enregistrer un consentement
consentLogSchema.statics.logConsent = async function(userId, consentType, consentGiven, ipAddress, userAgent, metadata = {}) {
  return await this.create({
    user: userId,
    consentType,
    consentGiven,
    consentVersion: '1.0',
    ipAddress,
    userAgent,
    metadata
  });
};

// Méthode statique pour obtenir le dernier consentement d'un utilisateur
consentLogSchema.statics.getLatestConsent = async function(userId, consentType) {
  return await this.findOne({ user: userId, consentType })
    .sort({ consentDate: -1 })
    .limit(1);
};

// Méthode statique pour obtenir l'historique des consentements
consentLogSchema.statics.getConsentHistory = async function(userId) {
  return await this.find({ user: userId })
    .sort({ consentDate: -1 });
};

module.exports = mongoose.model('ConsentLog', consentLogSchema);
