// backend/controllers/timeEntry.controller.js
import TimeEntry from '../models/timeEntry.model.js';
import User from '../models/user.model.js';

// Clock In
export const clockIn = async (req, res) => {
  try {
    const { userId, latitude, longitude, address } = req.body;

    // Validate required fields
    if (!userId || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'User ID and location are required'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if user already has an active session
    const activeSession = await TimeEntry.getActiveSession(userId);
    if (activeSession) {
      return res.status(400).json({
        success: false,
        error: 'You already have an active clock-in session',
        data: activeSession
      });
    }

    // Get current date at start of day for workDate
    const workDate = new Date();
    workDate.setHours(0, 0, 0, 0);

    // Create new time entry
    const timeEntry = await TimeEntry.create({
      userId,
      companyId: user.companyId,
      clockInTime: new Date(),
      clockInLocation: {
        latitude,
        longitude,
        address: address || ''
      },
      workDate,
      status: 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Clocked in successfully',
      data: timeEntry
    });

  } catch (error) {
    console.error('Clock in error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clock in'
    });
  }
};

// Clock Out
export const clockOut = async (req, res) => {
  try {
    const { userId, latitude, longitude, address, notes } = req.body;

    // Validate required fields
    if (!userId || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'User ID and location are required'
      });
    }

    // Find active session
    const activeSession = await TimeEntry.getActiveSession(userId);
    if (!activeSession) {
      return res.status(400).json({
        success: false,
        error: 'No active clock-in session found'
      });
    }

    // Update the session
    activeSession.clockOutTime = new Date();
    activeSession.clockOutLocation = {
      latitude,
      longitude,
      address: address || ''
    };
    activeSession.status = 'completed';
    if (notes) {
      activeSession.notes = notes;
    }

    // Calculate total hours
    activeSession.calculateHours();
    
    await activeSession.save();

    res.status(200).json({
      success: true,
      message: 'Clocked out successfully',
      data: activeSession
    });

  } catch (error) {
    console.error('Clock out error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clock out'
    });
  }
};

// Get active session for a user
export const getActiveSession = async (req, res) => {
  try {
    const { userId } = req.params;

    const activeSession = await TimeEntry.getActiveSession(userId);

    res.status(200).json({
      success: true,
      data: activeSession
    });

  } catch (error) {
    console.error('Get active session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get active session'
    });
  }
};

// Get time entries for a user (with date range filter)
export const getUserTimeEntries = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, status } = req.query;

    const query = { userId };

    // Add date range filter if provided
    if (startDate || endDate) {
      query.workDate = {};
      if (startDate) {
        query.workDate.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.workDate.$lte = end;
      }
    }

    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    const timeEntries = await TimeEntry.find(query)
      .sort({ clockInTime: -1 })
      .populate('userId', 'personalInfo email');

    // Calculate total hours
    const totalHours = timeEntries
      .filter(entry => entry.status === 'completed')
      .reduce((sum, entry) => sum + entry.totalHours, 0);

    res.status(200).json({
      success: true,
      data: timeEntries,
      summary: {
        totalEntries: timeEntries.length,
        totalHours: totalHours.toFixed(2)
      }
    });

  } catch (error) {
    console.error('Get user time entries error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get time entries'
    });
  }
};

// Get all time entries for company (Admin view)
export const getCompanyTimeEntries = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { startDate, endDate, userId } = req.query;

    const query = { companyId };

    // Add date range filter
    if (startDate || endDate) {
      query.workDate = {};
      if (startDate) {
        query.workDate.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.workDate.$lte = end;
      }
    }

    // Filter by specific user if provided
    if (userId) {
      query.userId = userId;
    }

    const timeEntries = await TimeEntry.find(query)
      .sort({ clockInTime: -1 })
      .populate('userId', 'personalInfo email hourlyRate');

    // Group by user and calculate totals
    const userSummaries = {};
    
    timeEntries.forEach(entry => {
      const userId = entry.userId._id.toString();
      
      if (!userSummaries[userId]) {
        userSummaries[userId] = {
          user: entry.userId,
          totalHours: 0,
          entries: []
        };
      }
      
      if (entry.status === 'completed') {
        userSummaries[userId].totalHours += entry.totalHours;
      }
      userSummaries[userId].entries.push(entry);
    });

    res.status(200).json({
      success: true,
      data: timeEntries,
      userSummaries: Object.values(userSummaries)
    });

  } catch (error) {
    console.error('Get company time entries error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get company time entries'
    });
  }
};

// Get monthly report for a user
export const getMonthlyReport = async (req, res) => {
  try {
    const { userId } = req.params;
    const { year, month } = req.query;

    // Default to current month if not provided
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    const targetMonth = month ? parseInt(month) : new Date().getMonth() + 1;

    // Create date range for the month
    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

    const timeEntries = await TimeEntry.find({
      userId,
      workDate: {
        $gte: startDate,
        $lte: endDate
      },
      status: 'completed'
    }).sort({ workDate: 1 });

    // Get user with hourly rate
    const user = await User.findById(userId);

    // Calculate totals
    const totalHours = timeEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
    const totalPayment = totalHours * (user?.hourlyRate || 0);

    // Group by date
    const dailyEntries = {};
    timeEntries.forEach(entry => {
      const dateKey = entry.workDate.toISOString().split('T')[0];
      if (!dailyEntries[dateKey]) {
        dailyEntries[dateKey] = {
          date: dateKey,
          entries: [],
          totalHours: 0
        };
      }
      dailyEntries[dateKey].entries.push(entry);
      dailyEntries[dateKey].totalHours += entry.totalHours;
    });

    res.status(200).json({
      success: true,
      data: {
        user,
        period: {
          year: targetYear,
          month: targetMonth,
          startDate,
          endDate
        },
        summary: {
          totalHours: totalHours.toFixed(2),
          totalPayment: totalPayment.toFixed(2),
          hourlyRate: user?.hourlyRate || 0,
          workDays: Object.keys(dailyEntries).length
        },
        dailyEntries: Object.values(dailyEntries)
      }
    });

  } catch (error) {
    console.error('Get monthly report error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get monthly report'
    });
  }
};