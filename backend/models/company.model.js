// backend/models/company.model.js
import mongoose from 'mongoose';  // <-- THIS LINE WAS MISSING!

const companySchema = new mongoose.Schema({
  // Basic Company Info
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  
  // Contact Information
  contact: {
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    address: {
      street: String,
      city: String,
      country: {
        type: String,
        default: 'Algeria'
      }
    }
  },
  
  // Company Settings
  settings: {
    requirePhotoVerification: {
      type: Boolean,
      default: true
    },
    
    workHours: {
      start: {
        type: String,
        default: "08:00"
      },
      end: {
        type: String,
        default: "17:00"
      }
    },
    currency: {
      type: String,
      default: 'DZD'
    }
  },

  pendingApplications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Array of active company members
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});


export default mongoose.model('Company', companySchema);