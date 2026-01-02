// backend/controllers/company.controller.js
import User from "../models/user.model.js";
import Company from "../models/company.model.js";

// Get company information
export const getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.user.companyId);

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.status(200).json(company);
  } catch (error) {
    console.log("ERROR in getCompany", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update company information
export const updateCompany = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Only admin can update company information" });
    }

    const { name, phone, address } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData['contact.phone'] = phone;
    if (address) updateData['contact.address'] = address;

    const company = await Company.findByIdAndUpdate(
      req.user.companyId,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Company updated successfully",
      company
    });
  } catch (error) {
    console.log("ERROR in updateCompany", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all users (workers) in the company
export const getCompanyUsers = async (req, res) => {
  try {
    const users = await User.find({
      companyId: req.user.companyId,
      role: 'worker'
    })
      .select('-password')
      .populate('jobTypeId')
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.log("ERROR in getCompanyUsers", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get pending applications
export const getPendingApplications = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Only admin can view pending applications" });
    }

    const pendingUsers = await User.find({
      companyId: req.user.companyId,
      role: 'worker',
      applicationStatus: 'pending'
    })
      .select('-password')
      .populate('jobTypeId')
      .sort({ appliedAt: -1 });

    res.status(200).json(pendingUsers);
  } catch (error) {
    console.log("ERROR in getPendingApplications", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Approve application
export const approveApplication = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Only admin can approve applications" });
    }

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findOne({
      _id: userId,
      companyId: req.user.companyId
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.applicationStatus = 'approved';
    user.isActive = true;
    user.reviewedAt = new Date();
    user.reviewedBy = req.user._id;

    await user.save();

    // Remove from pending applications and add to team members
    await Company.findByIdAndUpdate(req.user.companyId, {
      $pull: { pendingApplications: userId },
      $addToSet: { teamMembers: userId }
    });

    res.status(200).json({
      message: "Application approved successfully",
      user
    });
  } catch (error) {
    console.log("ERROR in approveApplication", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Reject application
export const rejectApplication = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Only admin can reject applications" });
    }

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findOne({
      _id: userId,
      companyId: req.user.companyId
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.applicationStatus = 'rejected';
    user.isActive = false;
    user.reviewedAt = new Date();
    user.reviewedBy = req.user._id;

    await user.save();

    // Remove from pending applications
    await Company.findByIdAndUpdate(req.user.companyId, {
      $pull: { pendingApplications: userId }
    });

    res.status(200).json({
      message: "Application rejected",
      user
    });
  } catch (error) {
    console.log("ERROR in rejectApplication", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update worker information (admin only)
export const updateWorker = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Only admin can update worker information" });
    }

    const { userId } = req.params;
    const { firstName, lastName, phone, jobTypeId, hourlyRate } = req.body;

    const user = await User.findOne({
      _id: userId,
      companyId: req.user.companyId,
      role: 'worker'
    });

    if (!user) {
      return res.status(404).json({ error: "Worker not found" });
    }

    // Update fields
    if (firstName) user.personalInfo.firstName = firstName;
    if (lastName) user.personalInfo.lastName = lastName;
    if (phone) user.personalInfo.phone = phone;
    if (jobTypeId) user.jobTypeId = jobTypeId;
    if (hourlyRate !== undefined) user.hourlyRate = hourlyRate;

    await user.save();
    await user.populate('jobTypeId');

    res.status(200).json({
      message: "Worker updated successfully",
      user
    });
  } catch (error) {
    console.log("ERROR in updateWorker", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete worker (admin only)
export const deleteWorker = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Only admin can delete workers" });
    }

    const { userId } = req.params;

    const user = await User.findOne({
      _id: userId,
      companyId: req.user.companyId,
      role: 'worker'
    });

    if (!user) {
      return res.status(404).json({ error: "Worker not found" });
    }

    // Remove from company's team members
    await Company.findByIdAndUpdate(req.user.companyId, {
      $pull: { 
        teamMembers: userId,
        pendingApplications: userId 
      }
    });

    await user.deleteOne();

    res.status(200).json({
      message: "Worker deleted successfully"
    });
  } catch (error) {
    console.log("ERROR in deleteWorker", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Toggle worker active status (admin only)
export const toggleWorkerStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Only admin can toggle worker status" });
    }

    const { userId } = req.params;

    const user = await User.findOne({
      _id: userId,
      companyId: req.user.companyId,
      role: 'worker'
    });

    if (!user) {
      return res.status(404).json({ error: "Worker not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      message: `Worker ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    console.log("ERROR in toggleWorkerStatus", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};