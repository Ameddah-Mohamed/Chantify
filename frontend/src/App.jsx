import { Link } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Chantify — Demo Dashboard</h1>
        <p className="text-sm text-gray-600 mb-6">Use the links below to open pages you created.</p>
        <ul className="space-y-3">
          <li>
            <Link to="/worker/weekly" className="text-[#f3ae3f] hover:underline font-medium">Worker Weekly Tasks</Link>
          </li>
          <li>
            <Link to="/tasks" className="text-[#f3ae3f] hover:underline font-medium">Task — Weekly / Create</Link>
          </li>
          <li>
            <Link to="/tasks/123" className="text-[#f3ae3f] hover:underline font-medium">Task Details (example id)</Link>
          </li>
          <li>
            <Link to="/admin/projects" className="text-[#f3ae3f] hover:underline font-medium">Project Management</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
