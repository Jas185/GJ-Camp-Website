const mongoose = require('mongoose');

const transactionLogSchema = new mongoose.Schema({
  orderID: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true
  },
  registrationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration'
  },
  amount: { 
    type: Number, 
    required: true 
  },
  currency: { 
    type: String, 
    default: 'EUR' 
  },
  status: { 
    type: String, 
    required: true,
    enum: ['COMPLETED', 'PENDING', 'REFUNDED', 'REVERSED', 'DENIED']
  },
  payerEmail: String,
  payerName: String,
  ipAddress: String,
  userAgent: String,
  verificationResult: {
    type: Object,
    default: {}
  },
  isDevelopmentMode: {
    type: Boolean,
    default: false
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  refundedAt: Date,
  chargebackAt: Date,
  notes: String
}, {
  timestamps: true
});

// Index pour recherches fréquentes
transactionLogSchema.index({ userId: 1, createdAt: -1 });
transactionLogSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('TransactionLog', transactionLogSchema);
