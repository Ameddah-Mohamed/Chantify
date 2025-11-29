export default function Breadcrumbs() {
return (
<div className="flex items-center gap-2 text-sm mb-6">
<a className="text-primary hover:underline">Dashboard</a>
<span className="text-gray-400">/</span>
<a className="text-primary hover:underline">Tasks</a>
<span className="text-gray-400">/</span>
<span className="text-gray-600 dark:text-gray-400">Install Electrical Wiring</span>
</div>
);
}