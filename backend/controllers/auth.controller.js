// backend/controllers/auth.controller.js
import User from "../models/user.model.js";
import Company from "../models/company.model.js";
import generateTokenAndSetCookie from "../lib/utils/generateToken.js";
import bcrypt from "bcryptjs";

import JobType from "../models/jobType.model.js";

// DEFAULT JOB TYPES
const DEFAULT_JOB_TYPES = [
  { name: "Maçon", hourlyRate: 800 },
  { name: "Électricien", hourlyRate: 900 },
  { name: "Plombier", hourlyRate: 850 },
  { name: "Charpentier", hourlyRate: 750 },
  { name: "Peintre", hourlyRate: 700 },
  { name: "Carreleur", hourlyRate: 800 },
  { name: "Soudeur", hourlyRate: 950 },
  { name: "Manœuvre", hourlyRate: 500 }
];


export const signup = async (req, res) => {
  console.log('\n========== SIGNUP REQUEST STARTED ==========');
  console.log('Request body:', req.body);
  
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      role, 
      companyName,
      companyEmail,
      jobTypeId
    } = req.body;

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format');
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('❌ User already exists');
      return res.status(400).json({ error: "User already exists with this email" });
    }

    // Password validation
    if (password.length < 6) {
      console.log('❌ Password too short');
      return res.status(400).json({
        error: "Password must be at least 6 characters long"
      });
    }


    let companyId;
    let finalRole = role || 'worker';
    let isActive = true;
    let applicationStatus = 'approved';
    let selectedJobTypeId = null;
    let calculatedHourlyRate = 0;


    // Handle ADMIN registration (creates company)
    if (finalRole === 'admin') {
      
      if (!companyName) {
        console.log('❌ Company name missing');
        return res.status(400).json({ error: "Company name is required for admin registration" });
      }

      // Create new company
      const newCompany = new Company({
        name: companyName,
        contact: {
          email: email.toLowerCase()
        },
        pendingApplications: [],
        teamMembers: []
      });
      
      await newCompany.save();
      companyId = newCompany._id;
    
      
      try {
        let createdCount = 0;
        
        for (let i = 0; i < DEFAULT_JOB_TYPES.length; i++) {
          const jobTypeData = DEFAULT_JOB_TYPES[i];
          console.log(`\n[${i + 1}/${DEFAULT_JOB_TYPES.length}] Creating job type: ${jobTypeData.name}`);
          console.log('Data:', jobTypeData);
          
          const jobType = new JobType({
            name: jobTypeData.name,
            hourlyRate: jobTypeData.hourlyRate,
            companyId: newCompany._id
          });
          
          console.log('JobType object created:', jobType);
          console.log('Attempting to save...');
          
          const savedJobType = await jobType.save();
          createdCount++;
          
          console.log(`✅ Successfully saved! ID: ${savedJobType._id}`);
        }
        
      } catch (error) {
        console.error('\n❌❌❌ ERROR CREATING JOB TYPES ❌❌❌');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Full error object:', error);
        // Continue with user creation even if job types fail
      }
      
      isActive = true;
      applicationStatus = 'approved';
      calculatedHourlyRate = 0;
      
    } 
    // Handle WORKER registration (applies to existing company)
    else if (companyEmail) {

      
      if (!jobTypeId) {
        console.log('❌ Job type ID missing');
        return res.status(400).json({ 
          error: "Job type is required for worker registration" 
        });
      }

      // Find company by contact email
      const company = await Company.findOne({ 
        'contact.email': companyEmail.toLowerCase() 
      });

      if (!company) {
        console.log('❌ Company not found');
        return res.status(400).json({ error: "Company not found with this email" });
      }


      // Verify that the jobType exists and belongs to this company
      const selectedJobType = await JobType.findOne({
        _id: jobTypeId,
        companyId: company._id,
        isActive: true
      });

      if (!selectedJobType) {
        console.log('❌ Job type not found or invalid');
        
        // Debug: Check what job types exist for this company
        const allJobTypes = await JobType.find({ companyId: company._id });
        
        return res.status(400).json({ 
          error: "Invalid job type selected for this company" 
        });
      }

      companyId = company._id;
      selectedJobTypeId = selectedJobType._id;
      calculatedHourlyRate = selectedJobType.hourlyRate;
      
      // Worker needs admin approval
      isActive = false;
      applicationStatus = 'pending';

    } else {
      console.log('❌ Company email missing for worker');
      return res.status(400).json({ 
        error: "For worker registration, company email is required" 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log('Password hashed');

    // Create new user
    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      personalInfo: {
        firstName,
        lastName,
        phone: phone || ''
      },
      hourlyRate: calculatedHourlyRate,
      jobTypeId: selectedJobTypeId,
      role: finalRole,
      companyId,
      isActive,
      applicationStatus,
      appliedAt: new Date()
    });


    await newUser.save();
    console.log('✅ User saved to database. User ID:', newUser._id);

    // If worker, add to company's pending applications
    if (finalRole === 'worker') {
      console.log('Adding worker to pending applications...');
      const company = await Company.findById(companyId);
      if (company) {
        company.pendingApplications.push(newUser._id);
        await company.save();
        console.log('✅ Added to pending applications');
      }
    } 
    // If admin, add to company's team members
    else if (finalRole === 'admin') {
      console.log('Adding admin to team members...');
      const company = await Company.findById(companyId);
      if (company) {
        company.teamMembers.push(newUser._id);
        await company.save();
        console.log('✅ Added to team members');
      }
      
      // Generate token and set cookie for admin (auto-login)
      generateTokenAndSetCookie(newUser._id, res);
    }

    // Populate company and jobType info for response
    await newUser.populate('companyId');
    
    if (newUser.jobTypeId) {
      await newUser.populate('jobTypeId');
    }

    const response = {
      _id: newUser._id,
      email: newUser.email,
      personalInfo: newUser.personalInfo,
      hourlyRate: newUser.hourlyRate,
      jobType: newUser.jobTypeId,
      role: newUser.role,
      isActive: newUser.isActive,
      applicationStatus: newUser.applicationStatus,
      company: newUser.companyId
    };

    // Different messages based on role
    if (finalRole === 'admin') {
      console.log('✅ ADMIN SIGNUP COMPLETED SUCCESSFULLY ✅\n');
      res.status(201).json({
        message: "Admin account and company created successfully!",
        ...response
      });
    } else {
      console.log('✅ WORKER SIGNUP COMPLETED SUCCESSFULLY ✅\n');
      res.status(201).json({
        message: "Application submitted successfully! Waiting for company approval.",
        ...response
      });
    }

  } catch (error) {
    console.error('\n❌❌❌ FATAL ERROR IN SIGNUP ❌❌❌');
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Full error:", error);
    res.status(500).json({ error: error.message });
  }
};

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