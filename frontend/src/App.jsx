import { Link } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-800 rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-4">Chantify — Demo Dashboard</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Use the links below to open pages you created.</p>
        <ul className="space-y-3">
          <li>
            <Link to="/worker/weekly" className="text-primary hover:underline">Worker Weekly Tasks</Link>
          </li>
          <li>
            <Link to="/tasks" className="text-primary hover:underline">Task — Weekly / Create</Link>
          </li>
          <li>
            <Link to="/tasks/123" className="text-primary hover:underline">Task Details (example id)</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
