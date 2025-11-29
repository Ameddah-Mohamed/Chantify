export default function AssignedTeam() {
const workers = ["a1.jpg", "a2.jpg", "a3.jpg"]; // replace URLs


return (
<div className="bg-white dark:bg-gray-800 border rounded-xl shadow-sm p-6">
<h2 className="text-xl font-bold mb-4">Assigned Team</h2>


<div className="flex -space-x-3">
{workers.map((img, i) => (
<div key={i} className="size-12 rounded-full bg-cover border-2 border-white dark:border-gray-800" style={{backgroundImage: `url(${img})`}}></div>
))}
<div className="size-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center font-semibold">+2</div>
</div>
</div>
);
}