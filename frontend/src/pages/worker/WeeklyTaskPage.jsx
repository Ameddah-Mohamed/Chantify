import React from "react";
import DaySection from "../../components/DaySection";
import TaskCard from "../../components/TaskCard";

export default function WeeklyTaskPage() {
	return (
		<div className="p-4 min-h-screen bg-gray-50">
			<main className="max-w-7xl mx-auto space-y-6">
				<DaySection day="Wednesday, 23" highlight>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<TaskCard
							title="Site Safety Inspection"
							project="General Site"
							status="In Progress"
							statusColor="bg-orange-100 text-orange-800"
							buttonLabel="Details"
							buttonColor="bg-orange-500 hover:bg-orange-600"
						/>
						<TaskCard
							title="Plumbing Rough-in - Lvl 5"
							project="Skyview Tower"
							status="Not Started"
							statusColor="bg-gray-200 text-gray-600"
							buttonLabel="Start"
							buttonColor="bg-blue-600 hover:bg-blue-700"
						/>
						<TaskCard
							title="Crane Maintenance"
							project="Heavy Machinery"
							status="Urgent"
							statusColor="bg-red-100 text-red-800"
							buttonLabel="Start"
							buttonColor="bg-red-600 hover:bg-red-700"
							border="border-l-4 border-red-500"
						/>
					</div>
				</DaySection>

				{/* Thursday */}
				<DaySection day="Thursday, 24">
					<p className="text-gray-500 text-sm py-4">No tasks scheduled.</p>
				</DaySection>

				{/* Friday */}
				<DaySection day="Friday, 25">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<TaskCard
							title="Window Installation - Lvl 9"
							project="Skyview Tower"
							status="Not Started"
							statusColor="bg-gray-200 text-gray-600"
							buttonLabel="Start"
							buttonColor="bg-blue-600 hover:bg-blue-700"
						/>
					</div>
				</DaySection>

				{/* Saturday */}
				<DaySection day="Saturday, 26">
					<p className="text-gray-500 text-sm py-4">No tasks scheduled.</p>
				</DaySection>

				{/* Sunday */}
				<DaySection day="Sunday, 27">
					<p className="text-gray-500 text-sm py-4">No tasks scheduled.</p>
				</DaySection>
			</main>
		</div>
	);
}