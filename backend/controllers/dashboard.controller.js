// backend/controllers/dashboard.controller.js
import User from "../models/user.model.js";
import Company from "../models/company.model.js";
import Task from "../models/task.model.js";
import WorkerTask from "../models/workerTask.model.js";
import mongoose from "mongoose";

// Make sure Task has completedAt field when status becomes 'completed'
// You might need to add a pre-save hook in task.model.js if not already there

export const getDashboardStats = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { range = 'week' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    if (range === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (range === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (range === 'year') {
      startDate.setFullYear(now.getFullYear() - 1);
    }

    // Get total workers
    const totalWorkers = await User.countDocuments({
      companyId,
      role: 'worker'
    });

    // Get active workers
    const activeWorkers = await User.countDocuments({
      companyId,
      role: 'worker',
      isActive: true
    });

    // Get pending applications
    const company = await Company.findById(companyId);
    const pendingApplications = company?.pendingApplications?.length || 0;

    // Get task statistics
    const [activeTasks, completedTasks, inProgressTasks, totalTasks] = await Promise.all([
      Task.countDocuments({ companyId, status: { $in: ['todo', 'in-progress'] } }),
      Task.countDocuments({ companyId, status: 'completed' }),
      Task.countDocuments({ companyId, status: 'in-progress' }),
      Task.countDocuments({ companyId })
    ]);

    // Calculate completion rate
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Task Distribution
    const taskDistribution = [
      { name: 'To Do', value: await Task.countDocuments({ companyId, status: 'todo' }) },
      { name: 'In Progress', value: inProgressTasks },
      { name: 'Completed', value: completedTasks }
    ];

    // Workers by Job Type
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
          localField: 'jobTypeId',
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
      },
      { $sort: { count: -1 } }
    ]);

    // Task Completion Trend (last 7 days)
    const taskCompletionTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const [completed, created] = await Promise.all([
        Task.countDocuments({
          companyId,
          status: 'completed',
          completedAt: { $gte: date, $lt: nextDate }
        }),
        Task.countDocuments({
          companyId,
          createdAt: { $gte: date, $lt: nextDate }
        })
      ]);

      taskCompletionTrend.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completed,
        created
      });
    }

    // Recent Activity
    const recentTasks = await WorkerTask.find({})
      .populate({
        path: 'workerId',
        match: { companyId },
        select: 'personalInfo'
      })
      .populate('taskId', 'title')
      .sort({ updatedAt: -1 })
      .limit(5);

    const recentActivity = recentTasks
      .filter(wt => wt.workerId && wt.taskId)
      .map(wt => {
        const timeDiff = Math.floor((now - new Date(wt.updatedAt)) / 1000 / 60);
        const timeStr = timeDiff < 60 ? `${timeDiff}m ago` : 
                       timeDiff < 1440 ? `${Math.floor(timeDiff / 60)}h ago` : 
                       `${Math.floor(timeDiff / 1440)}d ago`;

        return {
          type: wt.status === 'completed' ? 'task_completed' :
                wt.status === 'in-progress' ? 'task_started' : 'task_assigned',
          description: `${wt.workerId.personalInfo.firstName} ${
            wt.status === 'completed' ? 'completed' :
            wt.status === 'in-progress' ? 'started working on' : 'was assigned'
          } "${wt.taskId.title}"`,
          time: timeStr
        };
      });

    // Top Performers
    const topPerformers = await WorkerTask.aggregate([
      {
        $match: {
          status: 'completed',
          completedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$workerId',
          completedTasks: { $sum: 1 }
        }
      },
      { $sort: { completedTasks: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'workerInfo'
        }
      },
      {
        $unwind: '$workerInfo'
      },
      {
        $match: {
          'workerInfo.companyId': new mongoose.Types.ObjectId(companyId)
        }
      },
      {
        $lookup: {
          from: 'jobtypes',
          localField: 'workerInfo.jobTypeId',
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
        $project: {
          name: {
            $concat: [
              '$workerInfo.personalInfo.firstName',
              ' ',
              '$workerInfo.personalInfo.lastName'
            ]
          },
          jobType: { $ifNull: ['$jobTypeInfo.name', 'Unassigned'] },
          completedTasks: 1
        }
      }
    ]);

    res.status(200).json({
      totalWorkers,
      activeWorkers,
      activeTasks,
      completedTasks,
      inProgressTasks,
      pendingApplications,
      completionRate,
      taskDistribution,
      workersByJobType,
      taskCompletionTrend,
      recentActivity,
      topPerformers
    });

  } catch (error) {
    console.log("ERROR in getDashboardStats", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};