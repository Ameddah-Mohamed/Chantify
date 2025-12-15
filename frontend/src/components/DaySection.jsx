const DaySection = ({ day, children, highlight }) => {
return (
<div className={`flex flex-col gap-4 ${highlight ? "p-4 rounded-xl border-2 border-blue-500 bg-blue-50" : ""}`}>
<h2 className={`text-lg font-bold pb-2 border-b ${highlight ? "text-blue-600 border-blue-300" : "text-gray-900 border-gray-200"}`}>
{day}
</h2>
{children}
</div>
);
};

export default DaySection;