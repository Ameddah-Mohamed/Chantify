// backend/controllers/timeEntry.controller.js
import TimeEntry from '../models/timeEntry.model.js';
import MonthlySummary from '../models/monthlySummary.model.js';
import User from '../models/user.model.js';
import Company from '../models/company.model.js';

// Clock In
export const clockIn = async (req, res) => {
  try {
    const { userId, latitude, longitude, address } = req.body;

    // Validate required fields
    if (!userId || (latitude === undefined || latitude === null) || (longitude === undefined || longitude === null)) {
      return res.status(400).json({
        success: false,
        error: 'User ID and location (latitude, longitude) are required'
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
        error: 'You already have an active clock-in session. Please clock out first.',
        data: activeSession
      });
    }

    // Check if user already clocked in today (once-per-day constraint)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayEntry = await TimeEntry.findOne({
      userId,
      workDate: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (todayEntry) {
      return res.status(400).json({
        success: false,
        error: 'Already clocked in today.',
        data: todayEntry
      });
    }

    // Get current date at start of day for workDate
    const workDate = new Date();
    workDate.setHours(0, 0, 0, 0);

    // Create new time entry with proper location validation
    const timeEntry = await TimeEntry.create({
      userId,
      companyId: user.companyId,
      clockInTime: new Date(),
      clockInLocation: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address: address || ''
      },
      workDate,
      status: 'active'
    });

    // Get company location info
    const company = await Company.findById(user.companyId);

    res.status(201).json({
      success: true,
      message: 'Clocked in successfully',
      data: {
        _id: timeEntry._id,
        userId: timeEntry.userId,
        clockInTime: timeEntry.clockInTime,
        clockInLocation: timeEntry.clockInLocation,
        workDate: timeEntry.workDate,
        status: timeEntry.status,
        companyLocation: company?.location || null
      }
    });

  } catch (error) {
    console.error('Clock in error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clock in: ' + (error.message || 'Unknown error')
    });
  }
};

// Clock Out
export const clockOut = async (req, res) => {
  try {
    const { userId, latitude, longitude, address, notes } = req.body;

    // Validate required fields
    if (!userId || (latitude === undefined || latitude === null) || (longitude === undefined || longitude === null)) {
      return res.status(400).json({
        success: false,
        error: 'User ID and location (latitude, longitude) are required'
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
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      address: address || ''
    };
    activeSession.status = 'completed';
    if (notes) {
      activeSession.notes = notes;
    }

    // Calculate total hours
    activeSession.calculateHours();
    
    await activeSession.save();

    // ATOMIC UPDATE: Update MonthlySummary with the new hours
    // This ensures the monthly total is never calculated incorrectly
    const workYear = activeSession.workDate.getFullYear();
    const workMonth = activeSession.workDate.getMonth() + 1;
    
    await MonthlySummary.addHours(
      userId,
      activeSession.companyId,
      workYear,
      workMonth,
      activeSession.totalHours,
      activeSession.workDate
    );

    res.status(200).json({
      success: true,
      message: 'Clocked out successfully',
      data: {
        _id: activeSession._id,
        userId: activeSession.userId,
        clockInTime: activeSession.clockInTime,
        clockOutTime: activeSession.clockOutTime,
        clockInLocation: activeSession.clockInLocation,
        clockOutLocation: activeSession.clockOutLocation,
        totalHours: activeSession.totalHours,
        workDate: activeSession.workDate,
        status: activeSession.status
      }
    });

  } catch (error) {
    console.error('Clock out error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clock out: ' + (error.message || 'Unknown error')
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

// Get daily time entries for a user
export const getDailyEntries = async (req, res) => {
  try {
    const { userId, date } = req.params;

    // Parse the date (format: YYYY-MM-DD)
    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    // Set time to start of day for consistent queries
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const timeEntries = await TimeEntry.find({
      userId,
      workDate: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).sort({ clockInTime: 1 });

    // Calculate total hours
    const totalHours = timeEntries
      .filter(entry => entry.status === 'completed')
      .reduce((sum, entry) => sum + entry.totalHours, 0);

    res.status(200).json({
      success: true,
      data: {
        date: date,
        sessions: timeEntries,
        totalHours: parseFloat(totalHours.toFixed(2))
      }
    });

  } catch (error) {
    console.error('Get daily entries error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get daily entries'
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

// Get all monthly summaries for a user
export const getUserMonthlySummaries = async (req, res) => {
  try {
    const { userId } = req.params;

    const summaries = await MonthlySummary.find({ userId })
      .sort({ year: -1, month: -1 })
      .select('month year monthKey totalMonthlyHours workDaysCount lastUpdated');

    res.status(200).json({
      success: true,
      data: summaries
    });

  } catch (error) {
    console.error('Get monthly summaries error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get monthly summaries'
    });
  }
};

// Get session history for a user (for admin view)
export const getSessionHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, skip = 0, startDate, endDate } = req.query;

    const query = { userId, status: 'completed' };

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

    const sessions = await TimeEntry.find(query)
      .sort({ clockInTime: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select('workDate clockInTime clockOutTime totalHours clockInLocation status');

    const total = await TimeEntry.countDocuments(query);

    res.status(200).json({
      success: true,
      data: sessions,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip)
      }
    });

  } catch (error) {
    console.error('Get session history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get session history'
    });
  }
};

// Force clear active session for a user (Admin only - for testing/emergencies)
export const forceClockOut = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find and remove any active sessions
    const result = await TimeEntry.deleteMany({
      userId,
      status: 'active'
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'No active session found to clear'
      });
    }

    // Also clear localStorage hint on client
    res.status(200).json({
      success: true,
      message: `Cleared ${result.deletedCount} active session(s)`,
      data: {
        clearedCount: result.deletedCount
      }
    });

  } catch (error) {
    console.error('Force clock out error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear active session'
    });
  }
};