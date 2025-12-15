// backend/controllers/jobType.controller.js
import JobType from "../models/jobType.model.js";

// Get all job types for company
export const getJobTypes = async (req, res) => {
  try {
    const jobTypes = await JobType.find({ 
      companyId: req.user.companyId,
      isActive: true 
    }).sort({ name: 1 });
    
    res.status(200).json(jobTypes);
  } catch (error) {
    console.log("ERROR in getJobTypes", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create new job type (admin only)
export const createJobType = async (req, res) => {
  try {
    const { name, baseSalary } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Only admin can create job types" });
    }

    if (!name || baseSalary === undefined) {
      return res.status(400).json({ error: "Name and base salary are required" });
    }

    const newJobType = new JobType({
      companyId: req.user.companyId,
      name,
      baseSalary
    });

    await newJobType.save();

    res.status(201).json({
      message: "Job type created successfully",
      jobType: newJobType
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Job type with this name already exists" });
    }
    console.log("ERROR in createJobType", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update job type (admin only)
export const updateJobType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, baseSalary } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Only admin can update job types" });
    }

    const jobType = await JobType.findOne({ 
      _id: id, 
      companyId: req.user.companyId 
    });

    if (!jobType) {
      return res.status(404).json({ error: "Job type not found" });
    }

    if (name) jobType.name = name;
    if (baseSalary !== undefined) jobType.baseSalary = baseSalary;

    await jobType.save();

    res.status(200).json({
      message: "Job type updated successfully",
      jobType
    });
  } catch (error) {
    console.log("ERROR in updateJobType", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete job type (admin only)
export const deleteJobType = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Only admin can delete job types" });
    }

    const jobType = await JobType.findOne({ 
      _id: id, 
      companyId: req.user.companyId 
    });

    if (!jobType) {
      return res.status(404).json({ error: "Job type not found" });
    }

    // Soft delete
    jobType.isActive = false;
    await jobType.save();

    res.status(200).json({ message: "Job type deleted successfully" });
  } catch (error) {
    console.log("ERROR in deleteJobType", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};