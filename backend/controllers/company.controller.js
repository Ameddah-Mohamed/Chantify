import Company from "../models/company.model.js";
import User from "../models/user.model.js";

// Get company profile
export const getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.user.companyId);
    
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.status(200).json(company);
  } catch (error) {
    console.log("ERROR in getCompany controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update company info (admin only)
export const updateCompany = async (req, res) => {
  try {
    const { name, contact, settings } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Only admin can update company information" });
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      req.user.companyId,
      {
        ...(name && { name }),
        ...(contact && { contact }),
        ...(settings && { settings })
      },
      { new: true, runValidators: true }
    );

    if (!updatedCompany) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.status(200).json({
      message: "Company updated successfully",
      company: updatedCompany
    });
  } catch (error) {
    console.log("ERROR in updateCompany controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// List all company users (active team members)
export const getCompanyUsers = async (req, res) => {
  try {
    const company = await Company.findById(req.user.companyId)
      .populate('teamMembers', '-password') // Populate teamMembers without password
      .select('teamMembers');

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.status(200).json(company.teamMembers);
  } catch (error) {
    console.log("ERROR in getCompanyUsers controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get pending applications with user details
export const getPendingApplications = async (req, res) => {
  try {
    const company = await Company.findById(req.user.companyId)
      .populate('pendingApplications', 'email personalInfo hourlyRate appliedAt');

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.status(200).json(company.pendingApplications);
  } catch (error) {
    console.log("ERROR in getPendingApplications", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Approve application
export const approveApplication = async (req, res) => {
  try {
    const { userId } = req.body;

    const company = await Company.findById(req.user.companyId);
    const user = await User.findById(userId);

    if (!company || !user || user.companyId.toString() !== company._id.toString()) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Update user status
    user.isActive = true;
    user.applicationStatus = 'approved';
    user.reviewedAt = new Date();
    user.reviewedBy = req.user._id;
    await user.save();

    // Move user from pending to team members
    company.pendingApplications = company.pendingApplications.filter(
      appId => appId.toString() !== userId
    );
    company.teamMembers.push(user._id);
    await company.save();

    res.status(200).json({
      message: "Application approved successfully",
      user: {
        _id: user._id,
        email: user.email,
        personalInfo: user.personalInfo,
        hourlyRate: user.hourlyRate
      }
    });

  } catch (error) {
    console.log("ERROR in approveApplication", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Reject application
export const rejectApplication = async (req, res) => {
  try {
    const { userId } = req.body;

    const company = await Company.findById(req.user.companyId);
    const user = await User.findById(userId);

    if (!company || !user || user.companyId.toString() !== company._id.toString()) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Update user status
    user.applicationStatus = 'rejected';
    user.reviewedAt = new Date();
    user.reviewedBy = req.user._id;
    await user.save();

    // Remove user from pending applications
    company.pendingApplications = company.pendingApplications.filter(
      appId => appId.toString() !== userId
    );
    await company.save();

    res.status(200).json({
      message: "Application rejected successfully"
    });

  } catch (error) {
    console.log("ERROR in rejectApplication", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};