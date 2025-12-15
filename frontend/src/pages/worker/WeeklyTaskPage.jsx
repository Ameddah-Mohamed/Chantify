import React, { useState, useEffect } from "react";
import DaySection from "../../components/DaySection";
import TaskCard from "../../components/TaskCard";
import { taskAPI } from "../../API/taskAPI";

export default function WeeklyTaskPage() {
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchTasks();
	}, []);

	const fetchTasks = async () => {
		try {
			setLoading(true);
			const response = await taskAPI.getAllTasks();
			setTasks(response.data || []);
			setError(null);
		} catch (err) {
			setError(err.message || 'Failed to fetch tasks');
			console.error('Error fetching tasks:', err);
		} finally {
			setLoading(false);
		}
	};

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
							onClick={fetchTasks}
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
						onClick={fetchTasks}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
					>
						Refresh
					</button>
				</div>

				{tasks.length === 0 ? (
					<div className="bg-white rounded-lg shadow p-8 text-center">
						<p className="text-gray-500">No tasks found. Create your first task!</p>
					</div>
				) : (
					<DaySection day="All Tasks" highlight>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{tasks.map((task) => (
								<TaskCard
									key={task._id}
									task={task}
									onStatusUpdate={fetchTasks}
								/>
							))}
						</div>
					</DaySection>
				)}
			</main>
		</div>
	);
}