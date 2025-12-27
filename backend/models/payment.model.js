// backend/models/payment.model.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
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
  
  // Period
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
  
  // Hours and Salary Calculation
  totalHours: {
    type: Number,
    required: true,
    default: 0
  },
  hourlyRate: {
    type: Number,
    required: true,
    default: 0
  },
  baseSalary: {
    type: Number,
    required: true,
    default: 0
  },
  
  // Adjustments
  bonus: {
    type: Number,
    default: 0,
    min: 0
  },
  penalties: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Final Amount
  finalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  
  // Status
  status: {
    type: String,
    enum: ['unpaid', 'paid'],
    default: 'unpaid'
  },
  
  // Payment Details
  paidAt: Date,
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Notes
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Compound index to ensure one payment per user per month
paymentSchema.index({ userId: 1, year: 1, month: 1 }, { unique: true });
paymentSchema.index({ companyId: 1, year: 1, month: 1 });
paymentSchema.index({ status: 1 });

// Method to calculate final amount
paymentSchema.methods.calculateFinalAmount = function() {
  this.finalAmount = this.baseSalary + this.bonus - this.penalties;
  return this.finalAmount;
};

// Static method to get or create payment for a user/month
paymentSchema.statics.getOrCreatePayment = async function(userId, year, month) {
  const User = mongoose.model('User');
  const TimeEntry = mongoose.model('TimeEntry');
  
  // Check if payment already exists
  let payment = await this.findOne({ userId, year, month });
  
  if (payment) {
    return payment;
  }
  
  // Get user data
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  // Calculate total hours for the month
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);
  
  const timeEntries = await TimeEntry.find({
    userId,
    workDate: { $gte: startDate, $lte: endDate },
    status: 'completed'
  });
  
  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
  const baseSalary = totalHours * user.hourlyRate;
  
  // Create new payment
  payment = await this.create({
    userId,
    companyId: user.companyId,
    month,
    year,
    totalHours,
    hourlyRate: user.hourlyRate,
    baseSalary,
    bonus: 0,
    penalties: 0,
    finalAmount: baseSalary,
    status: 'unpaid'
  });
  
  return payment;
};

export default mongoose.model('Payment', paymentSchema);