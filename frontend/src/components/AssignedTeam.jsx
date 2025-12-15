export default function AssignedTeam() {
const workers = [
  "https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff",
  "https://ui-avatars.com/api/?name=Jane+Smith&background=10b981&color=fff",
  "https://ui-avatars.com/api/?name=Mike+Johnson&background=f59e0b&color=fff"
];


return (
<div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
<h2 className="text-xl font-bold text-gray-900 mb-4">Assigned Team</h2>


<div className="flex -space-x-3">
{workers.map((img, i) => (
<div key={i} className="size-12 rounded-full bg-cover border-2 border-white" style={{backgroundImage: `url(${img})`}}></div>
))}
<div className="size-12 bg-gray-200 rounded-full flex items-center justify-center font-semibold text-gray-700">+2</div>
</div>
</div>
);
}