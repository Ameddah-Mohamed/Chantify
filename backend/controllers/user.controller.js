// backend/controllers/user.controller.js
import User from "../models/user.model.js";
import Company from "../models/company.model.js";

// Get logged-in user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -invitationToken')
      .populate('companyId')
      .populate('jobTypeId');
    
    res.status(200).json(user);
  } catch (error) {
    console.log("ERROR in getProfile controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        'personalInfo.firstName': firstName,
        'personalInfo.lastName': lastName,
        'personalInfo.phone': phone
      },
      { new: true, runValidators: true }
    ).select('-password')
     .populate('companyId')
     .populate('jobTypeId');

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.log("ERROR in updateProfile controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get user by ID (Admin only)
export const getUserById = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can view user details' });
    }

    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .select('-password -invitationToken')
      .populate('companyId')
      .populate('jobTypeId');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("ERROR in getUserById controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update user payment info (Admin only)
export const updateUserPaymentInfo = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can update payment info' });
    }

    const { userId } = req.params;
    const { hourlyRate, baseSalary, expectedHoursPerDay, workingDaysPerMonth } = req.body;

    // Validate input values
    if (hourlyRate !== undefined && hourlyRate < 0) {
      return res.status(400).json({ error: 'Hourly rate must be non-negative' });
    }

    if (baseSalary !== undefined && baseSalary < 0) {
      return res.status(400).json({ error: 'Base salary must be non-negative' });
    }

    if (expectedHoursPerDay !== undefined && (expectedHoursPerDay < 0 || expectedHoursPerDay > 12)) {
      return res.status(400).json({ error: 'Expected hours per day must be between 0 and 12' });
    }

    if (workingDaysPerMonth !== undefined && (workingDaysPerMonth < 1 || workingDaysPerMonth > 31)) {
      return res.status(400).json({ error: 'Working days per month must be between 1 and 31' });
    }

    const updateData = {};
    if (hourlyRate !== undefined) updateData.hourlyRate = Number(hourlyRate);
    if (baseSalary !== undefined) updateData.baseSalary = Number(baseSalary);
    if (expectedHoursPerDay !== undefined) updateData.expectedHoursPerDay = expectedHoursPerDay === null ? null : Number(expectedHoursPerDay);
    if (workingDaysPerMonth !== undefined) updateData.workingDaysPerMonth = Number(workingDaysPerMonth);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password')
     .populate('companyId')
     .populate('jobTypeId');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: "Payment information updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.log("ERROR in updateUserPaymentInfo controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all users in company (Admin only)
export const getCompanyUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can view company users' });
    }

    const { search } = req.query;
    
    // Build query for company users
    let query = {
      companyId: req.user.companyId,
      role: 'worker',
      applicationStatus: 'approved' // Only approved workers can be assigned tasks
    };

    // Add search filter if provided
    if (search) {
      query.$or = [
        { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
        { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password -invitationToken')
      .populate('jobTypeId')
      .sort({ 'personalInfo.firstName': 1 });

    res.status(200).json(users);
  } catch (error) {
    console.log("ERROR in getCompanyUsers controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get pending workers for company (Admin only)
export const getPendingWorkers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can view pending workers' });
    }

    const workers = await User.find({
      companyId: req.user.companyId,
      role: 'worker'
    })
    .select('-password -invitationToken')
    .populate('jobTypeId')
    .sort({ appliedAt: -1 });

    res.status(200).json(workers);
  } catch (error) {
    console.log("ERROR in getPendingWorkers controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Approve or reject worker application (Admin only)
export const approveWorkerApplication = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can approve workers' });
    }

    const { userId } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be "approved" or "rejected"' });
    }

    const worker = await User.findById(userId);
    
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    if (worker.role !== 'worker') {
      return res.status(400).json({ error: 'User is not a worker' });
    }

    if (worker.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ error: 'Cannot approve workers from other companies' });
    }

    // Update the worker's application status
    worker.applicationStatus = status;
    if (status === 'approved') {
      worker.isActive = true;
    } else {
      worker.isActive = false;
    }

    await worker.save();

    // Also update the company's pending applications array
    if (status === 'approved') {
      await Company.findByIdAndUpdate(
        req.user.companyId,
        { $pull: { pendingApplications: userId } },
        { new: true }
      );
    }

    const updatedWorker = await User.findById(userId)
      .select('-password -invitationToken')
      .populate('companyId')
      .populate('jobTypeId');

    res.status(200).json({
      message: `Worker application ${status} successfully`,
      user: updatedWorker
    });
  } catch (error) {
    console.log("ERROR in approveWorkerApplication controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};