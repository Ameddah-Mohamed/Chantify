const DaySection = ({ day, children, highlight }) => {
return (
<div className={`flex flex-col gap-4 ${highlight ? "p-4 rounded-xl border-2 border-primary bg-primary/10 dark:bg-primary/20" : ""}`}>
<h2 className={`text-lg font-bold pb-2 border-b ${highlight ? "text-primary dark:text-sky-300 border-primary/50" : "text-[#0d141b] dark:text-slate-50 border-slate-200 dark:border-slate-700"}`}>
{day}
</h2>
{children}
</div>
);
};