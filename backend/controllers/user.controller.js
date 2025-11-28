//user.controller.js

import User from "../models/user.model.js";

// Get logged-in user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -invitationToken')
      .populate('companyId');
    
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
     .populate('companyId');

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.log("ERROR in updateProfile controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};