import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';

// @desc    Get all workers for admin to select
// @route   GET /api/users
// @access  Public
const getUsers = asyncHandler(async (req, res) => {
  try {
    const { search } = req.query;
    
    console.log('\n========== GET USERS REQUEST ==========');
    console.log('Search term:', search);
    
    // Build query for workers only
    let query = { 
      role: 'worker',
      isActive: true
    };
    
    console.log('Base query:', query);
    
    // Add search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { 'personalInfo.firstName': searchRegex },
        { 'personalInfo.lastName': searchRegex },
        { email: searchRegex }
      ];
      console.log('Search query:', query);
    }
    
    // Fetch workers from database
    let users = await User.find(query)
      .select('personalInfo email role companyId jobTypeId isActive')
      .populate('jobTypeId', 'name hourlyRate')
      .populate('companyId', 'name')
      .sort({ 'personalInfo.firstName': 1 });
    
    // If no active workers found, try to find any users with worker role (including inactive)
    if (users.length === 0 && !search) {
      console.log('No active workers found, checking all workers...');
      const allWorkers = await User.find({ role: 'worker' })
        .select('personalInfo email role companyId jobTypeId isActive')
        .populate('jobTypeId', 'name hourlyRate')
        .populate('companyId', 'name')
        .sort({ 'personalInfo.firstName': 1 });
      
      console.log('All workers (including inactive):', allWorkers.length);
      users = allWorkers;
    }
    
    // If still no workers, check all users
    if (users.length === 0) {
      console.log('No workers found, checking all users...');
      const allUsers = await User.find({})
        .select('personalInfo email role companyId jobTypeId isActive')
        .populate('jobTypeId', 'name hourlyRate')
        .populate('companyId', 'name')
        .sort({ 'personalInfo.firstName': 1 });
      
      console.log('All users in database:', allUsers.length);
      users = allUsers;
    }
    
    console.log('Found users:', users.length);
    console.log('Users data:', users.map(u => ({
      id: u._id,
      name: `${u.personalInfo.firstName} ${u.personalInfo.lastName}`,
      email: u.email,
      role: u.role,
      isActive: u.isActive
    })));
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

export { getUsers };

// Test endpoint to check all users
export const getAllUsersTest = async (req, res) => {
  try {
    const allUsers = await User.find({})
      .select('personalInfo email role isActive')
      .sort({ createdAt: -1 });
    
    console.log('All users in database:', allUsers.length);
    allUsers.forEach(user => {
      console.log(`- ${user.personalInfo.firstName} ${user.personalInfo.lastName} (${user.email}) - Role: ${user.role}, Active: ${user.isActive}`);
    });
    
    res.json({
      success: true,
      count: allUsers.length,
      data: allUsers
    });
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch all users'
    });
  }
};
