export const ProjectTable = () => {
const data = [
{
name: "Skyscraper Tower",
location: "123 Main St, Metropolis",
status: "On Track",
statusColor: "green",
start: "2023-01-15",
end: "2025-06-30",
},
{
name: "Downtown Mall Renovation",
location: "456 Oak Ave, Gotham",
status: "In Progress",
statusColor: "blue",
start: "2022-09-01",
end: "2024-12-20",
},
];


return (
<div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
<div className="overflow-x-auto">
<table className="w-full">
<thead className="bg-gray-50 dark:bg-gray-800/50">
<tr>
{['Project Name','Location','Status','Start Date','Projected End Date','Actions'].map((header) => (
<th key={header} className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
{header}
</th>
))}
</tr>
</thead>
<tbody className="divide-y divide-gray-200 dark:divide-gray-800">
{data.map((row) => (
<tr key={row.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
<td className="px-6 py-4 text-sm font-semibold">{row.name}</td>
<td className="px-6 py-4 text-sm text-gray-500">{row.location}</td>
<td className="px-6 py-4">
<span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-${row.statusColor}-100 text-${row.statusColor}-800`}>
{row.status}
</span>
</td>
<td className="px-6 py-4 text-sm text-gray-500">{row.start}</td>
<td className="px-6 py-4 text-sm text-gray-500">{row.end}</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
{['visibility', 'edit', 'archive'].map((icon) => (
<button key={icon} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
<span className="material-symbols-outlined text-xl">{icon}</span>
</button>
))}
</div>
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
);
};