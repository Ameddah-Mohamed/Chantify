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
  estimatedHours: {
    type: Number,
    required: true,
    default: 0,
    description: 'Expected hours per month (from job type or contract)'
  },
  actualHours: {
    type: Number,
    required: true,
    default: 0,
    description: 'Actual hours worked (from clock in/out)'
  },
  totalHours: {
    type: Number,
    required: true,
    default: 0,
    description: 'Total hours used for payment calculation (usually actualHours)'
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
  // Formula: TotalPay = (hourlyRate × estimatedHours) + baseSalary + Bonus - Penalties
  this.finalAmount = (this.hourlyRate * this.estimatedHours) + this.baseSalary + this.bonus - this.penalties;
  return this.finalAmount;
};

// Static method to get or create payment for a user/month
paymentSchema.statics.getOrCreatePayment = async function(userId, year, month) {
  const User = mongoose.model('User');
  const TimeEntry = mongoose.model('TimeEntry');
  const JobType = mongoose.model('JobType');
  
  // Check if payment already exists
  let payment = await this.findOne({ userId, year, month });
  
  if (payment) {
    return payment;
  }
  
  // Get user data
  const user = await User.findById(userId).populate('jobTypeId');
  if (!user) {
    throw new Error('User not found');
  }
  
  // Get working parameters with fallback to Job Type defaults
  const workingDaysPerMonth = user.workingDaysPerMonth || 22;
  const expectedHoursPerDay = user.expectedHoursPerDay !== null && user.expectedHoursPerDay !== undefined
    ? user.expectedHoursPerDay
    : (user.jobTypeId?.expectedHoursPerDay || 8);
  
  // Calculate estimated hours: workingDaysPerMonth × expectedHoursPerDay
  const estimatedHours = workingDaysPerMonth * expectedHoursPerDay;
  
  // Get worker's payment values with fallback to Job Type defaults
  const hourlyRate = user.hourlyRate || (user.jobTypeId?.hourlyRate || 0);
  const baseSalary = user.baseSalary || (user.jobTypeId?.baseSalary || 0);
  
  // Calculate total hours for the month (actual hours worked)
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);
  
  const timeEntries = await TimeEntry.find({
    userId,
    workDate: { $gte: startDate, $lte: endDate },
    status: 'completed'
  });
  
  const actualHours = timeEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
  
  // Calculate total pay using the formula:
  // TotalPay = (hourlyRate × workingDaysPerMonth × expectedHoursPerDay) + baseSalary + Bonus - Penalties
  const hoursBasedPay = hourlyRate * estimatedHours;
  const totalPayBeforeAdjustments = hoursBasedPay + baseSalary;
  
  // Create new payment
  payment = await this.create({
    userId,
    companyId: user.companyId,
    month,
    year,
    estimatedHours,
    actualHours,
    totalHours: actualHours, // Keep for backward compatibility
    hourlyRate,
    baseSalary,
    bonus: 0,
    penalties: 0,
    finalAmount: totalPayBeforeAdjustments,
    status: 'unpaid'
  });
  
  return payment;
};

export default mongoose.model('Payment', paymentSchema);