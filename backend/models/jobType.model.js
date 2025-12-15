// backend/models/jobType.model.js
import mongoose from 'mongoose';

const jobTypeSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  baseSalary: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique job type names per company
jobTypeSchema.index({ companyId: 1, name: 1 }, { unique: true });

export default mongoose.model('JobType', jobTypeSchema);