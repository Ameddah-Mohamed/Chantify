export default function TaskHeader() {
return (
<div className="flex flex-col gap-2">
<div className="flex items-center gap-3">
<h1 className="text-3xl font-black tracking-tight text-gray-900">Install Electrical Wiring - Unit 3B</h1>
<div className="bg-orange-100 px-3 rounded-full h-7 flex items-center">
<p className="text-orange-700 text-sm font-medium">In Progress</p>
</div>
</div>
<p className="text-gray-500">Task ID: #T5K-823</p>
</div>
);
}