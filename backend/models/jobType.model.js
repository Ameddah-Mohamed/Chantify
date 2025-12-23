// backend/models/jobType.model.js
import mongoose from 'mongoose';

const jobTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  expectedHoursPerDay: {  // ← Valeur par défaut pour ce job type
    type: Number,
    default: 8,
    min: 0,
    max: 12
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});



export default mongoose.model('JobType', jobTypeSchema);