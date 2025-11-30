export default function Breadcrumbs() {
return (
<div className="flex items-center gap-2 text-sm mb-6">
<a className="text-blue-600 hover:underline cursor-pointer">Dashboard</a>
<span className="text-gray-400">/</span>
<a className="text-blue-600 hover:underline cursor-pointer">Tasks</a>
<span className="text-gray-400">/</span>
<span className="text-gray-600">Install Electrical Wiring</span>
</div>
);
}