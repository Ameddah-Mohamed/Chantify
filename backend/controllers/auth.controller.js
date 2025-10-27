// backend/controllers/auth.controller.js
import User from "../models/user.model.js";
import Company from "../models/company.model.js";
import generateTokenAndSetCookie from "../lib/utils/generateToken.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      role, 
      companyName,
      companyEmail  // User provides company email to find and apply to company
    } = req.body;

    // Email Validation
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long"
      });
    }

    let companyId;
    let finalRole = role || 'worker';
    let isActive = true;
    let applicationStatus = 'approved'; // Default for admins

    // Handle ADMIN registration (creates company)
    if (finalRole === 'admin') {
      if (!companyName) {
        return res.status(400).json({ error: "Company name is required for admin registration" });
      }

      // Create new company
      const newCompany = new Company({
        name: companyName,
        contact: {
          email: email.toLowerCase() // Use admin email as company contact initially
        },
        pendingApplications: [],
        teamMembers: []
      });
      await newCompany.save();
      companyId = newCompany._id;
      
      // Admin is automatically active and approved
      isActive = true;
      applicationStatus = 'approved';
    } 
    // Handle WORKER registration (applies to existing company)
    else if (companyEmail) {
      // Find company by contact email
      const company = await Company.findOne({ 
        'contact.email': companyEmail.toLowerCase() 
      });

      if (!company) {
        return res.status(400).json({ error: "Company not found with this email" });
      }

      companyId = company._id;
      
      // Worker needs admin approval
      isActive = false;
      applicationStatus = 'pending';
    } else {
      return res.status(400).json({ 
        error: "For worker registration, company email is required" 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      personalInfo: {
        firstName,
        lastName,
        phone: phone || ''
      },
      hourlyRate: finalRole === 'worker' ? 500 : 0, // Workers get default rate, admins get 0
      role: finalRole,
      companyId,
      isActive,
      applicationStatus,
      appliedAt: new Date()
    });

    await newUser.save();

    // If worker, add to company's pending applications
    if (finalRole === 'worker') {
      const company = await Company.findById(companyId);
      if (company) {
        company.pendingApplications.push(newUser._id);
        await company.save();
      }
    } 
    // If admin, add to company's team members
    else if (finalRole === 'admin') {
      const company = await Company.findById(companyId);
      if (company) {
        company.teamMembers.push(newUser._id);
        await company.save();
      }
      
      // Generate token and set cookie for admin (auto-login)
      generateTokenAndSetCookie(newUser._id, res);
    }

    // Populate company info for response
    await newUser.populate('companyId');

    const response = {
      _id: newUser._id,
      email: newUser.email,
      personalInfo: newUser.personalInfo,
      hourlyRate: newUser.hourlyRate,
      role: newUser.role,
      isActive: newUser.isActive,
      applicationStatus: newUser.applicationStatus,
      company: newUser.companyId
    };

    // Different messages based on role
    if (finalRole === 'admin') {
      res.status(201).json({
        message: "Admin account and company created successfully!",
        ...response
      });
    } else {
      res.status(201).json({
        message: "Application submitted successfully! Waiting for company approval.",
        ...response
      });
    }

  } catch (error) {
    console.error("ERROR signing up:", error.message);
    res.status(500).json({ error: error.message });
  }
}

export const logout = async (req, res) => {
  try {
    if (!req.cookies.jwt) {
      return res.status(400).json({ error: "You are already logged out." });
    }

    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "Logged out successfully!" });
  } catch (error) {
    console.log("ERROR in logout controller", error.message);
    res.status(500).json({ error: "Error logging out" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate('companyId');
    res.json(user);
  } catch (error) {
    console.log("ERROR in getMe controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() })
      .populate('companyId');

    // Check if user exists
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Check if user is active OR is an admin (admins should always be able to login)
    if (!user.isActive && user.role !== 'admin') {
      return res.status(400).json({ 
        error: "Your account is pending approval from the company admin. Please wait for approval." 
      });
    }

    // Generate token and set cookie
    generateTokenAndSetCookie(user._id, res);

    // Send user details in response
    res.status(200).json({
      _id: user._id,
      email: user.email,
      personalInfo: user.personalInfo,
      hourlyRate: user.hourlyRate,
      role: user.role,
      isActive: user.isActive,
      applicationStatus: user.applicationStatus,
      company: user.companyId,
      message: user.isActive ? "Login successful" : "Account pending approval - limited access"
    });

  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};