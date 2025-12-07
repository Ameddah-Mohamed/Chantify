export const SearchAndFilters = () => (
<div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
<div className="lg:col-span-2">
<label className="flex flex-col h-12 w-full">
<div className="flex w-full items-stretch rounded-lg h-full shadow-sm bg-white dark:bg-gray-800">
<div className="text-gray-400 flex items-center justify-center pl-4">
<span className="material-symbols-outlined text-2xl">search</span>
</div>
<input
className="form-input flex w-full bg-transparent h-full px-3 text-base text-gray-900 dark:text-white"
placeholder="Search by Project Name or ID..."
/>
</div>
</label>
</div>


<div className="lg:col-span-2 flex flex-wrap items-center gap-3">
{['Status: All', 'Site Manager: All', 'Date Range'].map((label) => (
<button key={label} className="flex h-12 items-center justify-between gap-x-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm pl-4 pr-3 flex-1 md:w-48">
<p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
<span className="material-symbols-outlined text-gray-400">expand_more</span>
</button>
))}
</div>
</div>
);