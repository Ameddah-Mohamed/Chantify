export default function TaskDescriptionCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Task Description</h2>

      <p className="text-gray-700">
        Install electrical wiring for Unit 3B including routing conduits, pulling
        cables, and connecting to the main distribution panel. Ensure all work
        follows site safety protocols and meets local electrical code.
      </p>

      <ul className="mt-4 list-disc list-inside text-sm text-gray-600">
        <li>Verify circuit loads and breaker sizes</li>
        <li>Label all conduits and junction boxes</li>
        <li>Test continuity and insulation resistance</li>
      </ul>
    </div>
  );
}
