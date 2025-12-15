import React from 'react';

const PaymentDetails = ({ worker, onBack }) => {
  // Sample tasks data - in a real app, this would come from your API based on the worker
  const tasks = [
    { id: '#3451', name: 'Content Moderation', base: 600.00, rewards: 50.00, penalties: 0.00, total: 650.00 },
    { id: '#3452', name: 'Data Annotation', base: 500.00, rewards: 0.00, penalties: 50.00, total: 450.00 },
    { id: '#3453', name: 'Image Tagging', base: 800.00, rewards: 0.00, penalties: 0.00, total: 800.00 },
    { id: '#3454', name: 'Transcription', base: 500.00, rewards: 50.00, penalties: 50.00, total: 500.00 },
    { id: '#3455', name: 'Survey Analysis', base: 50.00, rewards: 0.00, penalties: 0.00, total: 50.00 }
  ];

  const totals = {
    base: tasks.reduce((sum, task) => sum + task.base, 0),
    rewards: tasks.reduce((sum, task) => sum + task.rewards, 0),
    penalties: tasks.reduce((sum, task) => sum + task.penalties, 0),
    total: tasks.reduce((sum, task) => sum + task.total, 0)
  };

  const finalSalary = worker.totalSalary + worker.bonus - worker.penalties;

  return (
    <div className="flex-1 p-8 bg-white overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button 
            onClick={onBack}
            className="text-gray-500 text-sm font-medium hover:text-[#1e2987] transition-colors"
          >
            Payments
          </button>
          <span className="text-gray-400 text-sm font-medium">/</span>
          <span className="text-gray-800 text-sm font-medium">{worker.name}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-[#1e2987] text-3xl md:text-4xl font-black">{worker.name}'s Salary Breakdown</h1>
            <p className="text-gray-500 text-base">For Period: Oct 1 - Oct 15, 2023</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-initial flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-white border border-gray-300 text-gray-800 text-sm font-bold hover:bg-gray-50 transition-colors">
              <span className="material-symbols-outlined text-base">download</span>
              <span>Export CSV</span>
            </button>
            <button className="flex-1 md:flex-initial flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-[#f3ae3f] text-[#1e2987] text-sm font-bold hover:bg-opacity-90 transition-colors">
              <span className="material-symbols-outlined text-base">check_circle</span>
              <span>Mark as Paid</span>
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Worker Info */}
          <div className="w-full lg:w-1/3 xl:w-1/4">
            <div className="flex flex-col gap-6 lg:sticky lg:top-8">
              {/* Worker Profile Card */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="bg-gray-200 rounded-full w-32 h-32 flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-600 text-6xl">person</span>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-gray-900 text-xl font-bold">{worker.name}</p>
                    <p className="text-gray-500 text-base">Task Worker</p>
                    <p className="text-gray-500 text-sm mt-1">ID: {worker.id}</p>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-gray-200 shadow-sm">
                  <p className="text-gray-600 text-base font-medium">Base Salary</p>
                  <p className="text-[#1e2987] text-3xl font-bold">${worker.totalSalary.toFixed(2)}</p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-gray-200 shadow-sm">
                  <p className="text-gray-600 text-base font-medium">Bonus</p>
                  <p className="text-green-600 text-3xl font-bold">+${worker.bonus.toFixed(2)}</p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-gray-200 shadow-sm">
                  <p className="text-gray-600 text-base font-medium">Penalties</p>
                  <p className="text-red-600 text-3xl font-bold">-${worker.penalties.toFixed(2)}</p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-6 bg-gradient-to-br from-[#1e2987] to-[#2a3a9f] text-white shadow-lg">
                  <p className="text-white/90 text-base font-medium">Final Salary</p>
                  <p className="text-white text-3xl font-black">${finalSalary.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Task Table */}
          <div className="w-full lg:w-2/3 xl:w-3/4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Task ID</th>
                      <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Task Name</th>
                      <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Base Salary</th>
                      <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Rewards (+)</th>
                      <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Penalties (-)</th>
                      <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {tasks.map((task, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-4 whitespace-nowrap text-sm font-medium text-gray-500">{task.id}</td>
                        <td className="p-4 whitespace-nowrap text-sm font-medium text-gray-800">{task.name}</td>
                        <td className="p-4 whitespace-nowrap text-sm font-medium text-gray-800 text-right">${task.base.toFixed(2)}</td>
                        <td className="p-4 whitespace-nowrap text-sm font-medium text-green-600 text-right">${task.rewards.toFixed(2)}</td>
                        <td className="p-4 whitespace-nowrap text-sm font-medium text-red-600 text-right">
                          {task.penalties > 0 ? `-$${task.penalties.toFixed(2)}` : '$0.00'}
                        </td>
                        <td className="p-4 whitespace-nowrap text-sm font-bold text-[#1e2987] text-right">${task.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                    <tr>
                      <td className="p-4 font-bold text-sm text-gray-800" colSpan="2">Totals</td>
                      <td className="p-4 text-right font-bold text-sm text-gray-800">${totals.base.toFixed(2)}</td>
                      <td className="p-4 text-right font-bold text-sm text-green-600">${totals.rewards.toFixed(2)}</td>
                      <td className="p-4 text-right font-bold text-sm text-red-600">-${totals.penalties.toFixed(2)}</td>
                      <td className="p-4 text-right font-extrabold text-lg text-[#1e2987]">${totals.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;