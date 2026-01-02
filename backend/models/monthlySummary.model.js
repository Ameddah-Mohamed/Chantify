// backend/models/monthlySummary.model.js
import mongoose from 'mongoose';

const monthlySummarySchema = new mongoose.Schema({
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
  
  // Month identifier (YYYY-MM format, e.g., "2024-01")
  monthKey: {
    type: String,
    required: true
  },
  
  // Extracted values for easy access
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  
  // Total hours worked in the month
  totalMonthlyHours: {
    type: Number,
    default: 0,
    required: true
  },
  
  // Number of days worked
  workDaysCount: {
    type: Number,
    default: 0
  },
  
  // Track if this month is finalized (no more updates)
  isFinalized: {
    type: Boolean,
    default: false
  },
  
  // Last update timestamp
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Composite index to ensure one record per user per month
monthlySummarySchema.index({ userId: 1, monthKey: 1 }, { unique: true });
monthlySummarySchema.index({ companyId: 1, monthKey: 1 });
monthlySummarySchema.index({ userId: 1, month: 1, year: 1 });

// Static method to get or create monthly summary for user
monthlySummarySchema.statics.getOrCreate = async function(userId, companyId, year, month) {
  const monthKey = `${year}-${String(month).padStart(2, '0')}`;
  
  let summary = await this.findOne({ userId, monthKey });
  
  if (!summary) {
    summary = await this.create({
      userId,
      companyId,
      monthKey,
      month,
      year,
      totalMonthlyHours: 0,
      workDaysCount: 0,
      isFinalized: false
    });
  }
  
  return summary;
};

// Static method to update hours atomically
monthlySummarySchema.statics.addHours = async function(userId, companyId, year, month, hours, workDate) {
  const monthKey = `${year}-${String(month).padStart(2, '0')}`;
  
  // Use findOneAndUpdate for atomic operation
  const updated = await this.findOneAndUpdate(
    { userId, monthKey },
    {
      $inc: { 
        totalMonthlyHours: hours,
        workDaysCount: 1
      },
      $set: { lastUpdated: new Date() }
    },
    { 
      new: true, 
      upsert: true, // Create if doesn't exist
      runValidators: false
    }
  );
  
  return updated;
};

// Instance method to get the display date range
monthlySummarySchema.methods.getDateRange = function() {
  const start = new Date(this.year, this.month - 1, 1);
  const end = new Date(this.year, this.month, 0, 23, 59, 59, 999);
  return { start, end };
};

export default mongoose.model('MonthlySummary', monthlySummarySchema);
