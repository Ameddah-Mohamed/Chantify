export default function AssignedTeam() {
const workers = ["a1.jpg", "a2.jpg", "a3.jpg"]; // replace URLs


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