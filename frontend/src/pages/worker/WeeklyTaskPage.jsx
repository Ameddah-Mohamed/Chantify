import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TaskCard from "../../components/TaskCard";
import { taskAPI } from "../../API/taskAPI";
import { workerTaskAPI } from "../../API/workerTaskAPI";

export default function WeeklyTaskPage() {
	const [tasks, setTasks] = useState([]);
	const [workerTasks, setWorkerTasks] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	
	// For now, we'll use a hardcoded worker ID
	// In a real app, this would come from user authentication context
	const currentWorkerId = "default-worker-id";

	useEffect(() => {
		fetchTasksAndStatuses();
	}, []);

	const fetchTasksAndStatuses = async () => {
		try {
			setLoading(true);
			const response = await taskAPI.getAllTasks();
			const tasksData = response.data || [];
			setTasks(tasksData);
			
			// Fetch worker task statuses for all tasks
			const statusPromises = tasksData.map(async (task) => {
				try {
					const statusResponse = await workerTaskAPI.getStatus(task._id, currentWorkerId);
					return { taskId: task._id, status: statusResponse.data?.status || 'todo' };
				} catch (err) {
					// If no worker task exists, default to 'todo'
					return { taskId: task._id, status: 'todo' };
				}
			});
			
			const statuses = await Promise.all(statusPromises);
			const statusMap = {};
			statuses.forEach(({ taskId, status }) => {
				statusMap[taskId] = status;
			});
			setWorkerTasks(statusMap);
			
			setError(null);
		} catch (err) {
			setError(err.message || 'Failed to fetch tasks');
			console.error('Error fetching tasks:', err);
		} finally {
			setLoading(false);
		}
	};

	const getWeekDays = () => {
		const days = [];
		const today = new Date();
		const currentDay = today.getDay();
		const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
		const monday = new Date(today.setDate(diff));

		for (let i = 0; i < 7; i++) {
			const date = new Date(monday);
			date.setDate(date.getDate() + i);
			days.push({
				date: date.toISOString().split('T')[0],
				dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
				dayDate: date.getDate()
			});
		}
		return days;
	};

	const getTasksForDay = (dateStr) => {
		return tasks.filter(task => {
			if (!task.dueDate) return false;
			const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
			return taskDate === dateStr;
		});
	};

	const handleTaskClick = (taskId) => {
		navigate(`/worker/task/${taskId}`);
	};

	const weekDays = getWeekDays();

	if (loading) {
		return (
			<div className="p-4 min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading tasks...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-4 min-h-screen bg-gray-50">
				<div className="max-w-7xl mx-auto">
					<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
						<p className="font-medium">Error loading tasks</p>
						<p className="text-sm">{error}</p>
						<button 
							onClick={fetchTasksAndStatuses}
							className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
						>
							Retry
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="p-4 min-h-screen bg-gray-50">
			<main className="max-w-7xl mx-auto space-y-6">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold text-gray-900">Weekly Tasks</h1>
					<button 
						onClick={fetchTasksAndStatuses}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
					>
						Refresh
					</button>
				</div>

				{/* Calendar Grid */}
				<div className="space-y-6">
					{weekDays.map((day) => {
						const dayTasks = getTasksForDay(day.date);
						return (
							<div key={day.date} className="bg-white rounded-lg shadow p-6">
								<h2 className="text-lg font-bold text-gray-900 mb-4">
									{day.dayName}, {day.dayDate}
								</h2>
								
								{dayTasks.length === 0 ? (
									<p className="text-gray-500 text-sm">No tasks scheduled</p>
								) : (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
										{dayTasks.map((task) => (
											<div 
												key={task._id}
												onClick={() => handleTaskClick(task._id)}
												className="cursor-pointer hover:shadow-lg transition-shadow"
											>
												<TaskCard
													task={{...task, status: workerTasks[task._id] || 'todo'}}
													workerId={currentWorkerId}
													onStatusUpdate={fetchTasksAndStatuses}
												/>
											</div>
										))}
									</div>
								)}
							</div>
						);
					})}
				</div>
			</main>
		</div>
	);
}