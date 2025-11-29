import React from "react";
import DaySection from "../../components/DaySection";
import TaskCard from "../../components/TaskCard";

export default function WeeklyTaskPage() {
	return (
		<div className="p-4">
			<main className="max-w-7xl mx-auto">
				<DaySection day="Wednesday, 23" highlight>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<TaskCard
							title="Site Safety Inspection"
							project="General Site"
							status="In Progress"
							statusColor="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
							buttonLabel="Details"
							buttonColor="bg-orange-500 hover:bg-orange-600"
						/>
						<TaskCard
							title="Plumbing Rough-in - Lvl 5"
							project="Skyview Tower"
							status="Not Started"
							statusColor="bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
							buttonLabel="Start"
							buttonColor="bg-primary"
						/>
						<TaskCard
							title="Crane Maintenance"
							project="Heavy Machinery"
							status="Urgent"
							statusColor="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
							buttonLabel="Start"
							buttonColor="bg-red-600 hover:bg-red-700"
							border="border-l-4 border-red-500"
						/>
					</div>
				</DaySection>

				{/* Thursday */}
				<DaySection day="Thursday, 24">
					<p className="text-slate-400 dark:text-slate-500 text-sm py-4">No tasks scheduled.</p>
				</DaySection>

				{/* Friday */}
				<DaySection day="Friday, 25">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<TaskCard
							title="Window Installation - Lvl 9"
							project="Skyview Tower"
							status="Not Started"
							statusColor="bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
							buttonLabel="Start"
							buttonColor="bg-primary"
						/>
					</div>
				</DaySection>

				{/* Saturday */}
				<DaySection day="Saturday, 26">
					<p className="text-slate-400 dark:text-slate-500 text-sm py-4">No tasks scheduled.</p>
				</DaySection>

				{/* Sunday */}
				<DaySection day="Sunday, 27">
					<p className="text-slate-400 dark:text-slate-500 text-sm py-4">No tasks scheduled.</p>
				</DaySection>
			</main>
		</div>
	);
}