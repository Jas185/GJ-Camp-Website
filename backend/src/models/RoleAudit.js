const mongoose = require('mongoose');
const { ROLES } = require('../constants/roles');

const roleAuditSchema = new mongoose.Schema({
  acteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cible: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ancienRole: {
    type: String,
    enum: ROLES,
    required: true,
  },
  nouveauRole: {
    type: String,
    enum: ROLES,
    required: true,
  },
  commentaire: {
    type: String,
    trim: true,
    maxlength: 400,
    default: '',
  },
  creeLe: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('RoleAudit', roleAuditSchema);
