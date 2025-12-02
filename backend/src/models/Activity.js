const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true
  },
  type: {
    type: String,
    enum: ['obligatoire', 'optionnelle'],
    required: [true, 'Le type est requis'],
    default: 'optionnelle'
  },
  heureDebut: {
    type: String, // Format HH:MM
    default: null
  },
  heureFin: {
    type: String, // Format HH:MM
    default: null
  },
  jour: {
    type: Number, // Jour 1, 2, 3, 4
    required: [true, 'Le jour est requis'],
    min: 1,
    max: 4
  },
  image: {
    type: String, // URL de l'image
    default: null
  },
  fichierPdf: {
    type: String, // URL du PDF
    default: null
  },
  referent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  dateCreation: {
    type: Date,
    default: Date.now
  },
  dateModification: {
    type: Date,
    default: Date.now
  },
  actif: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Mettre à jour la date de modification avant chaque sauvegarde
activitySchema.pre('save', function(next) {
  this.dateModification = Date.now();
  next();
});

module.exports = mongoose.model('Activity', activitySchema);
