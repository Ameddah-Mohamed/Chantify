const TaskCard = ({ title, project, status, statusColor, buttonLabel, buttonColor, border }) => {
return (
<div className={`flex flex-col rounded-lg shadow-[0_0_4px_rgba(0,0,0,0.1)] p-4 gap-3 bg-white dark:bg-slate-800 ${border || ""}`}>
<p className="text-[#0d141b] dark:text-slate-50 text-base font-bold">{title}</p>
<p className="text-slate-500 dark:text-slate-400 text-sm">Project: {project}</p>
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