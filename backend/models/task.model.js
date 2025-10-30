const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: String,
  project: String,
  status: { type: String, enum: ["todo", "in-progress", "completed"], default: "todo" },
  dueDate: Date,
  completedAt: Date,
  completionNotes: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", taskSchema);
