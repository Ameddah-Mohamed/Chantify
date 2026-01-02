import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: false
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    default: ''
  },
  project: {
    type: String,
    default: 'General'
  },
  location: {
    type: String,
    default: ''
  },
  approved: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'approved'],
    default: 'pending'
  },
  approvedAt: {
    type: Date
  },
  workerFiles: [{
    fileName: String,
    filePath: String,
    uploadedAt: Date,
    uploadedBy: String
  }],
  dueDate: Date,
  completionNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true 
});


taskSchema.index({ companyId: 1, approved: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ dueDate: 1 });

const Task = mongoose.model('Task', taskSchema);
export default Task;