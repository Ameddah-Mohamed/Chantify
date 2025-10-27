// backend/models/invitation.model.js (OPTIONAL - for future)
const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['worker', 'manager'],
    default: 'worker'
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'expired', 'cancelled'],
    default: 'pending'
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('Invitation', invitationSchema);