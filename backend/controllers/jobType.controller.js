// backend/controllers/jobType.controller.js
import JobType from "../models/jobType.model.js";
import Company from "../models/company.model.js";
import User from "../models/user.model.js";

// Get job types by company email (PUBLIC - for signup)
export const getJobTypesByCompany = async (req, res) => {
  try {
    const { companyEmail } = req.query;
    
    if (!companyEmail) {
      return res.status(400).json({ error: "Company email is required" });
    }

    const company = await Company.findOne({ 
      'contact.email': companyEmail.toLowerCase() 
    });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    const jobTypes = await JobType.find({ 
      companyId: company._id,
      isActive: true 
    }).sort({ name: 1 });

    res.status(200).json(jobTypes);
  } catch (error) {
    console.log("ERROR in getJobTypesByCompany", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all job types for the logged-in user's company
export const getCompanyJobTypes = async (req, res) => {
  try {
    const jobTypes = await JobType.find({ 
      companyId: req.user.companyId 
    }).sort({ name: 1 });

    res.status(200).json(jobTypes);
  } catch (error) {
    console.log("ERROR in getCompanyJobTypes", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create a new job type (admin only)
export const createJobType = async (req, res) => {
  try {
    const { name, hourlyRate, expectedHoursPerDay } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Only admin can create job types" });
    }

    if (!name || !hourlyRate) {
      return res.status(400).json({ error: "Name and hourly rate are required" });
    }

    if(!expectedHoursPerDay){
      return res.status(400).json({ error: "expectedHoursPerDay is required" });
    }

    if (hourlyRate < 0) {
      return res.status(400).json({ error: "Hourly rate must be positive" });
    }

    // Check if job type with same name already exists for this company
    const existingJobType = await JobType.findOne({
      name: name.trim(),
      companyId: req.user.companyId
    });

    if (existingJobType) {
      return res.status(400).json({ 
        error: "A job type with this name already exists in your company" 
      });
    }

    const newJobType = new JobType({
      name: name.trim(),
      hourlyRate,
      companyId: req.user.companyId,
      expectedHoursPerDay
    });

    await newJobType.save();

    res.status(201).json({
      message: "Job type created successfully",
      jobType: newJobType
    });
  } catch (error) {
    console.log("ERROR in createJobType", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a job type (admin only)
export const updateJobType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, hourlyRate, expectedHoursPerDay, isActive } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Only admin can update job types" });
    }

    if (hourlyRate !== undefined && hourlyRate < 0) {
      return res.status(400).json({ error: "Hourly rate must be positive" });
    }

    if(expectedHoursPerDay < 0 || expectedHoursPerDay > 12){
      return res.status(400).json({ error: "expectedHoursPerDay must be between 0 and 12" });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (hourlyRate !== undefined) updateData.hourlyRate = Number(hourlyRate);
    if (expectedHoursPerDay !== undefined) updateData.expectedHoursPerDay = Number(expectedHoursPerDay);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const updatedJobType = await JobType.findOneAndUpdate(
      { _id: id, companyId: req.user.companyId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedJobType) {
      return res.status(404).json({ error: "Job type not found" });
    }

    // If hourly rate was updated, update all workers with this job type
    if (hourlyRate !== undefined) {
      await User.updateMany(
        { jobTypeId: id, companyId: req.user.companyId },
        { hourlyRate: hourlyRate }
      );
    }

    res.status(200).json({
      message: "Job type updated successfully",
      jobType: updatedJobType
    });
  } catch (error) {
    console.log("ERROR in updateJobType", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a job type (admin only)
export const deleteJobType = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Only admin can delete job types" });
    }

    // Check if any users are using this job type
    const usersWithJobType = await User.countDocuments({ 
      jobTypeId: id,
      companyId: req.user.companyId 
    });

    if (usersWithJobType > 0) {
      return res.status(400).json({ 
        error: `Cannot delete job type: ${usersWithJobType} worker(s) are currently using it. Please reassign them first.` 
      });
    }

    const deletedJobType = await JobType.findOneAndDelete({
      _id: id,
      companyId: req.user.companyId
    });

    if (!deletedJobType) {
      return res.status(404).json({ error: "Job type not found" });
    }

    res.status(200).json({
      message: "Job type deleted successfully"
    });
  } catch (error) {
    console.log("ERROR in deleteJobType", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};