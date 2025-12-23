import asyncHandler from 'express-async-handler';

// Simple mock users for demo (replace with real DB query when User model is converted to CommonJS)
const mockUsers = [
  {
    _id: '1',
    personalInfo: {
      firstName: 'John',
      lastName: 'Smith',
      profilePicture: ''
    },
    email: 'john.smith@example.com',
    role: 'worker'
  },
  {
    _id: '2',
    personalInfo: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      profilePicture: ''
    },
    email: 'sarah.j@example.com',
    role: 'worker'
  },
  {
    _id: '3',
    personalInfo: {
      firstName: 'Mike',
      lastName: 'Davis',
      profilePicture: ''
    },
    email: 'mike.d@example.com',
    role: 'worker'
  },
  {
    _id: '4',
    personalInfo: {
      firstName: 'Emma',
      lastName: 'Wilson',
      profilePicture: ''
    },
    email: 'emma.w@example.com',
    role: 'worker'
  },
  {
    _id: '5',
    personalInfo: {
      firstName: 'James',
      lastName: 'Brown',
      profilePicture: ''
    },
    email: 'james.b@example.com',
    role: 'worker'
  }
];

// @desc    Get all users (simplified for demo)
// @route   GET /api/users
// @access  Public
const getUsers = asyncHandler(async (req, res) => {
  const { search } = req.query;
  
  let users = mockUsers;
  
  // Filter by search term
  if (search) {
    const searchLower = search.toLowerCase();
    users = users.filter(user => 
      user.personalInfo.firstName.toLowerCase().includes(searchLower) ||
      user.personalInfo.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  }
  
  res.json({
    success: true,
    count: users.length,
    data: users
  });
});

export { getUsers };
