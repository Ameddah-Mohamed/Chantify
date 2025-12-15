export default function TaskDetailsCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Task Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Detail icon="calendar_today" title="Due Date" value="December 15, 2023, 5:00 PM" />
        <Detail icon="location_on" title="Assigned Site" value="Oakridge Heights, 123 Construction Ave" />
        <Detail icon="person" title="Assigned By" value="Jane Doe, Project Manager" />
      </div>
    </div>
  );
}

function Detail({ icon, title, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="material-symbols-outlined text-blue-600 mt-1">{icon}</span>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600">{value}</p>
      </div>
    </div>
  );
}
