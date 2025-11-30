const TaskCard = ({ title, project, status, statusColor, buttonLabel, buttonColor, border }) => {
return (
<div className={`flex flex-col rounded-lg shadow-sm border border-gray-200 p-4 gap-3 bg-white ${border || ""}`}>
<p className="text-gray-900 text-base font-bold">{title}</p>
<p className="text-gray-600 text-sm">Project: {project}</p>
<div className="flex items-center justify-between mt-2 gap-3">
<span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor}`}>{status}</span>
<button className={`min-w-[84px] h-8 px-4 rounded-lg text-white text-sm font-medium ${buttonColor} hover:bg-opacity-90`}>
{buttonLabel}
</button>
</div>
</div>
);
};
export default TaskCard;