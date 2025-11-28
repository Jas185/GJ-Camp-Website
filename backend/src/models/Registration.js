const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firstName: {
    type: String,
    required: [true, 'Le prénom est obligatoire'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    trim: true
  },
  email: {
    type: String,
    required: [true, "L'email est obligatoire"],
    trim: true,
    lowercase: true
  },
  sex: {
    type: String,
    required: [true, 'Le sexe est obligatoire'],
    enum: ['M', 'F']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'La date de naissance est obligatoire']
  },
  address: {
    type: String,
    required: [true, "L'adresse postale est obligatoire"],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Le numéro de téléphone est obligatoire'],
    trim: true
  },
  refuge: {
    type: String,
    required: [true, 'Le refuge CRPT est obligatoire'],
    enum: ['Lorient', 'Laval', 'Amiens', 'Nantes', 'Autres']
  },
  hasAllergies: {
    type: Boolean,
    default: false
  },
  allergyDetails: {
    type: String,
    trim: true
  },
  totalPrice: {
    type: Number,
    default: 120
  },
  amountPaid: {
    type: Number,
    required: [true, 'Le montant payé est obligatoire'],
    min: [20, 'Le montant minimum est de 20 euros'],
    max: [120, 'Le montant ne peut pas dépasser 120 euros']
  },
  amountRemaining: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partial', 'paid'],
    default: 'unpaid'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Registration', registrationSchema);
