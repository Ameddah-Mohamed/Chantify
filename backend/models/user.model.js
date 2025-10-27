// backend/models/user.model.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Authentication
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // Company Reference
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  
  // Personal Information
  personalInfo: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    profilePicture: {
      type: String,
      default: ''
    }
  },
  
  hourlyRate: {
    type: Number,
    default: 500,
    min: 0
  },
  
  // Role & Status
  role: {
    type: String,
    enum: ['worker', 'admin'],
    default: 'worker'
  },
  
  // Invitation System
  invitationStatus: {
    type: String,
    enum: ['active', 'invited', 'inactive'],
    default: 'active'
  },
  invitationToken: {
    type: String,
    default: null
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },

  applicationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  appliedAt: {
    type: Date,
    default: Date.now
  },
  
  // When admin approves/rejects
  reviewedAt: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});


// Method to get full name
userSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

// Remove password when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model('User', userSchema);