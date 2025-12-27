// backend/controllers/payment.controller.js
import Payment from '../models/payment.model.js';
import User from '../models/user.model.js';
import TimeEntry from '../models/timeEntry.model.js';

// Get all payments for company (Admin)
export const getCompanyPayments = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Only admin can view company payments' 
      });
    }

    const { year, month, status } = req.query;
    
    const query = { companyId: req.user.companyId };
    
    if (year) query.year = parseInt(year);
    if (month) query.month = parseInt(month);
    if (status) query.status = status;

    const payments = await Payment.find(query)
      .populate('userId', 'personalInfo email hourlyRate jobTypeId')
      .populate({
        path: 'userId',
        populate: {
          path: 'jobTypeId',
          select: 'name'
        }
      })
      .sort({ year: -1, month: -1, 'userId.personalInfo.firstName': 1 });

    // Calculate summary stats
    const summary = {
      totalPaid: 0,
      totalUnpaid: 0,
      totalWorkers: payments.length
    };

    payments.forEach(payment => {
      if (payment.status === 'paid') {
        summary.totalPaid += payment.finalAmount;
      } else {
        summary.totalUnpaid += payment.finalAmount;
      }
    });

    res.status(200).json({
      success: true,
      data: payments,
      summary
    });

  } catch (error) {
    console.error('Get company payments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get company payments'
    });
  }
};

// Generate payments for all workers for a specific month
export const generateMonthlyPayments = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Only admin can generate payments' 
      });
    }

    const { year, month } = req.body;

    if (!year || !month) {
      return res.status(400).json({
        success: false,
        error: 'Year and month are required'
      });
    }

    // Get all active workers in the company
    const workers = await User.find({
      companyId: req.user.companyId,
      role: 'worker',
      isActive: true
    });

    const generatedPayments = [];
    const errors = [];

    for (const worker of workers) {
      try {
        const payment = await Payment.getOrCreatePayment(worker._id, year, month);
        generatedPayments.push(payment);
      } catch (error) {
        errors.push({
          workerId: worker._id,
          workerName: `${worker.personalInfo.firstName} ${worker.personalInfo.lastName}`,
          error: error.message
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Generated ${generatedPayments.length} payments`,
      data: generatedPayments,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Generate monthly payments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate monthly payments'
    });
  }
};

// Get payment details for a specific worker and month
export const getPaymentDetails = async (req, res) => {
  try {
    const { userId, year, month } = req.params;

    // Check authorization
    if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this payment'
      });
    }

    const payment = await Payment.findOne({
      userId,
      year: parseInt(year),
      month: parseInt(month)
    })
      .populate('userId', 'personalInfo email hourlyRate jobTypeId')
      .populate({
        path: 'userId',
        populate: {
          path: 'jobTypeId',
          select: 'name'
        }
      });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    // Get time entries for this month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const timeEntries = await TimeEntry.find({
      userId,
      workDate: { $gte: startDate, $lte: endDate },
      status: 'completed'
    }).sort({ workDate: 1 });

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
        payment,
        timeEntries: Object.values(dailyEntries),
        summary: {
          totalDays: Object.keys(dailyEntries).length,
          totalHours: payment.totalHours,
          hourlyRate: payment.hourlyRate
        }
      }
    });

  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payment details'
    });
  }
};

// Update payment (bonus, penalties, notes)
export const updatePayment = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admin can update payments'
      });
    }

    const { paymentId } = req.params;
    const { bonus, penalties, notes } = req.body;

    const payment = await Payment.findOne({
      _id: paymentId,
      companyId: req.user.companyId
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    // Update fields
    if (bonus !== undefined) payment.bonus = Math.max(0, Number(bonus));
    if (penalties !== undefined) payment.penalties = Math.max(0, Number(penalties));
    if (notes !== undefined) payment.notes = notes;

    // Recalculate final amount
    payment.calculateFinalAmount();
    
    await payment.save();

    await payment.populate('userId', 'personalInfo email');

    res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      data: payment
    });

  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update payment'
    });
  }
};

// Toggle payment status (paid/unpaid)
export const togglePaymentStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admin can change payment status'
      });
    }

    const { paymentId } = req.params;

    const payment = await Payment.findOne({
      _id: paymentId,
      companyId: req.user.companyId
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    // Toggle status
    if (payment.status === 'unpaid') {
      payment.status = 'paid';
      payment.paidAt = new Date();
      payment.paidBy = req.user._id;
    } else {
      payment.status = 'unpaid';
      payment.paidAt = null;
      payment.paidBy = null;
    }

    await payment.save();
    await payment.populate('userId', 'personalInfo email');

    res.status(200).json({
      success: true,
      message: `Payment marked as ${payment.status}`,
      data: payment
    });

  } catch (error) {
    console.error('Toggle payment status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle payment status'
    });
  }
};

// Get worker's own payments
export const getMyPayments = async (req, res) => {
  try {
    const { year } = req.query;
    
    const query = { userId: req.user._id };
    if (year) query.year = parseInt(year);

    const payments = await Payment.find(query)
      .sort({ year: -1, month: -1 });

    res.status(200).json({
      success: true,
      data: payments
    });

  } catch (error) {
    console.error('Get my payments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payments'
    });
  }
};