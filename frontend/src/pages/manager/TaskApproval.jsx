import React, { useState } from 'react';

const TaskApproval = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState([
    {
      id: 1,
      worker: 'Jane Doe',
      taskName: 'Q3 Marketing Report Finalization',
      completed: 'Oct 26, 2023, 10:15 AM',
      deadline: 'Oct 27, 2023, 5:00 PM',
      photo: 'https://cdn.usegalileo.ai/sdxl10/8f0e3c8d-40a5-4e0e-9e4a-3c5f5e5f5e5f.png',
      checked: false
    },
    {
      id: 2,
      worker: 'John Smith',
      taskName: 'Update Client Database',
      completed: 'Oct 26, 2023, 9:45 AM',
      deadline: 'Oct 26, 2023, 12:00 PM',
      photo: 'https://cdn.usegalileo.ai/sdxl10/9f1e4d9e-51b6-5f1f-af5b-4d6f6f6f6f6f.png',
      checked: false,
      overdue: true
    },
    {
      id: 3,
      worker: 'Emily White',
      taskName: 'Office Supply Inventory Check',
      completed: 'Oct 25, 2023, 3:20 PM',
      deadline: 'Oct 25, 2023, 5:00 PM',
      photo: 'https://cdn.usegalileo.ai/sdxl10/af2f5e0f-62c7-6g2g-bg6c-5e7g7g7g7g7g.png',
      checked: false
    }
  ]);

  const handleApprove = (id) => {
    console.log('Approved task:', id);
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleReject = (id) => {
    console.log('Rejected task:', id);
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleCheckbox = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, checked: !task.checked } : task
    ));
  };

  return (
    <div className="flex-1 p-8 bg-white overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <h1 className="text-[#1e2987] text-4xl font-black">Task Approval Center</h1>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#1e2987] focus:border-transparent"
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            </div>
          </div>
        </div>

        {/* Task Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left w-14">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 text-[#1e2987] focus:ring-2 focus:ring-[#1e2987]"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-gray-600 text-sm font-semibold">Worker</th>
                  <th className="px-4 py-3 text-left text-gray-600 text-sm font-semibold">Task Name</th>
                  <th className="px-4 py-3 text-left text-gray-600 text-sm font-semibold">Completed</th>
                  <th className="px-4 py-3 text-left text-gray-600 text-sm font-semibold">Deadline</th>
                  <th className="px-4 py-3 text-left text-gray-600 text-sm font-semibold">Photos</th>
                  <th className="px-4 py-3 text-left text-gray-400 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="h-[72px] px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={task.checked}
                        onChange={() => handleCheckbox(task.id)}
                        className="h-5 w-5 rounded border-gray-300 text-[#1e2987] focus:ring-2 focus:ring-[#1e2987]"
                      />
                    </td>
                    <td className="h-[72px] px-4 py-2 text-gray-900 text-sm font-normal">{task.worker}</td>
                    <td className="h-[72px] px-4 py-2 text-gray-500 text-sm font-normal">{task.taskName}</td>
                    <td className="h-[72px] px-4 py-2 text-gray-500 text-sm font-normal">{task.completed}</td>
                    <td className={`h-[72px] px-4 py-2 text-sm font-normal ${task.overdue ? 'text-red-500' : 'text-gray-500'}`}>
                      {task.deadline}
                    </td>
                    <td className="h-[72px] px-4 py-2">
                      <div className="bg-gray-200 rounded-md w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-300">
                        <span className="material-symbols-outlined text-gray-600">image</span>
                      </div>
                    </td>
                    <td className="h-[72px] px-4 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(task.id)}
                          className="flex items-center justify-center rounded-lg h-9 px-3 bg-[#1e2987] text-white text-sm font-bold hover:bg-opacity-90 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(task.id)}
                          className="flex items-center justify-center rounded-lg h-9 px-3 bg-gray-200 text-gray-800 text-sm font-medium hover:bg-gray-300 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State (shown when no tasks) */}
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-6 py-16 border-2 border-dashed border-gray-200 rounded-lg mt-8">
            <span className="material-symbols-outlined text-[#1e2987] text-6xl">task_alt</span>
            <div className="flex flex-col items-center gap-2">
              <p className="text-gray-900 text-lg font-bold text-center">All caught up!</p>
              <p className="text-gray-500 text-sm text-center">There are no tasks pending your approval at the moment.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskApproval;