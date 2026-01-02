// backend/models/timeEntry.model.js
import mongoose from 'mongoose';

const timeEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  
  // Clock In Details
  clockInTime: {
    type: Date,
    required: true
  },
  clockInLocation: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    address: String  // Optional: reverse geocoded address
  },
  
  // Clock Out Details
  clockOutTime: {
    type: Date,
    default: null
  },
  clockOutLocation: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  
  // Calculated Fields
  totalHours: {
    type: Number,
    default: 0
  },
  
  // Date for easy querying (stored as start of day)
  workDate: {
    type: Date,
    required: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  
  // Notes (optional)
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
timeEntrySchema.index({ userId: 1, workDate: 1 });
timeEntrySchema.index({ companyId: 1, workDate: 1 });
timeEntrySchema.index({ userId: 1, status: 1 });

// Method to calculate total hours
timeEntrySchema.methods.calculateHours = function() {
  if (this.clockOutTime && this.clockInTime) {
    const diffMs = this.clockOutTime - this.clockInTime;
    this.totalHours = diffMs / (1000 * 60 * 60); // Convert to hours
    return this.totalHours;
  }
  return 0;
};

// Static method to get user's active session
timeEntrySchema.statics.getActiveSession = async function(userId) {
  return await this.findOne({ 
    userId, 
    status: 'active' 
  }).sort({ clockInTime: -1 });
};

// Static method to get daily total for a user
timeEntrySchema.statics.getDailyTotal = async function(userId, date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const entries = await this.find({
    userId,
    workDate: {
      $gte: startOfDay,
      $lte: endOfDay
    },
    status: 'completed'
  });
  
  return entries.reduce((total, entry) => total + entry.totalHours, 0);
};

export default mongoose.model('TimeEntry', timeEntrySchema);