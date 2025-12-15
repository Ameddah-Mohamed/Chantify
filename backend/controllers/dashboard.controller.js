// backend/controllers/dashboard.controller.js
import User from "../models/user.model.js";
import Company from "../models/company.model.js";
import mongoose from "mongoose";

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const Task = mongoose.model('Task'); // Assuming Task model exists

    // Get active workers count
    const activeWorkers = await User.countDocuments({
      companyId,
      role: 'worker',
      isActive: true
    });

    // Get pending applications count
    const company = await Company.findById(companyId);
    const pendingApplications = company?.pendingApplications?.length || 0;

    // Get tasks statistics
    const [activeTasks, completedTasks, inProgressTasks] = await Promise.all([
      Task.countDocuments({ companyId, status: { $ne: 'completed' } }),
      Task.countDocuments({ companyId, status: 'completed' }),
      Task.countDocuments({ companyId, status: 'in-progress' })
    ]);

    // Calculate total salaries for current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const workers = await User.find({
      companyId,
      role: 'worker',
      isActive: true
    }).select('hourlyRate');

    // This is simplified - you'll need actual timesheet data
    const estimatedMonthlySalaries = workers.reduce((sum, worker) => {
      return sum + (worker.hourlyRate * 160); // Assuming 160 hours/month
    }, 0);

    // Get workers by job type
    const workersByJobType = await User.aggregate([
      {
        $match: {
          companyId: new mongoose.Types.ObjectId(companyId),
          role: 'worker',
          isActive: true
        }
      },
      {
        $lookup: {
          from: 'jobtypes',
          localField: 'jobType',
          foreignField: '_id',
          as: 'jobTypeInfo'
        }
      },
      {
        $unwind: {
          path: '$jobTypeInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$jobTypeInfo.name',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          jobType: { $ifNull: ['$_id', 'Unassigned'] },
          count: 1,
          _id: 0
        }
      }
    ]);

    // Get task status distribution
    const taskStatusDist = await Task.aggregate([
      { $match: { companyId: new mongoose.Types.ObjectId(companyId) } },
      { $group: { _id: '$status', value: { $sum: 1 } } },
      {
        $project: {
          name: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id', 'todo'] }, then: 'To Do' },
                { case: { $eq: ['$_id', 'in-progress'] }, then: 'In Progress' },
                { case: { $eq: ['$_id', 'completed'] }, then: 'Completed' }
              ],
              default: 'Unknown'
            }
          },
          value: 1,
          _id: 0
        }
      }
    ]);

    // Add colors to task status
    const taskStatusColors = {
      'To Do': '#8884d8',
      'In Progress': '#f3ae3f',
      'Completed': '#82ca9d'
    };
    const taskStatus = taskStatusDist.map(item => ({
      ...item,
      color: taskStatusColors[item.name] || '#ccc'
    }));

    res.status(200).json({
      stats: {
        activeTasks,
        activeWorkers,
        salariesPaidMTD: estimatedMonthlySalaries,
        pendingApplications
      },
      workersByJobType,
      taskStatus
    });

  } catch (error) {
    console.log("ERROR in getDashboardStats", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};