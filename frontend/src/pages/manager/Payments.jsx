import React, { useState } from 'react';

const Payments = ({ onViewDetails }) => {
  const [activeFilter, setActiveFilter] = useState('All');

  const workers = [
    {
      id: 1,
      name: 'Alex Johnson',
      tasks: 128,
      totalSalary: 4500.00,
      bonus: 200.00,
      penalties: 0.00,
      status: 'Paid'
    },
    {
      id: 2,
      name: 'Maria Garcia',
      tasks: 95,
      totalSalary: 3200.00,
      bonus: 50.00,
      penalties: 25.00,
      status: 'Unpaid'
    },
    {
      id: 3,
      name: 'James Smith',
      tasks: 150,
      totalSalary: 5100.00,
      bonus: 350.00,
      penalties: 0.00,
      status: 'Pending'
    },
    {
      id: 4,
      name: 'Olivia Williams',
      tasks: 112,
      totalSalary: 4050.00,
      bonus: 150.00,
      penalties: 50.00,
      status: 'Paid'
    },
    {
      id: 5,
      name: 'David Chen',
      tasks: 88,
      totalSalary: 2900.00,
      bonus: 0.00,
      penalties: 0.00,
      status: 'Unpaid'
    }
  ];

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Unpaid':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateFinalSalary = (totalSalary, bonus, penalties) => {
    return totalSalary + bonus - penalties;
  };

  const handleRowClick = (worker) => {
    onViewDetails(worker);
  };

  return (
    <div className="flex-1 p-8 bg-white overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Page Heading */}
        <header className="mb-6">
          <h1 className="text-[#181511] text-3xl font-bold">Payment Dashboard</h1>
        </header>

        {/* Stats Section */}
        <section className="grid grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm font-medium">Total Salaries Paid (This Month)</p>
            <p className="text-gray-900 tracking-tight text-3xl font-bold">$125,430.00</p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm font-medium">Total Unpaid Salaries</p>
            <p className="text-gray-900 tracking-tight text-3xl font-bold">$48,210.50</p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm font-medium">Total Active Workers</p>
            <p className="text-gray-900 tracking-tight text-3xl font-bold">86</p>
          </div>
        </section>

        {/* Toolbar & Filters */}
        <section className="mb-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex gap-2">
            {['All', 'Paid', 'Unpaid', 'Pending'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 transition-colors ${
                  activeFilter === filter
                    ? 'bg-[#1e2987] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <p className="text-sm font-semibold">{filter}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Data Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-semibold" scope="col">Worker Name</th>
                  <th className="px-6 py-3 font-semibold" scope="col">Total Tasks</th>
                  <th className="px-6 py-3 font-semibold" scope="col">Base Salary</th>
                  <th className="px-6 py-3 font-semibold" scope="col">Bonus</th>
                  <th className="px-6 py-3 font-semibold" scope="col">Penalties</th>
                  <th className="px-6 py-3 font-semibold" scope="col">Final Salary</th>
                  <th className="px-6 py-3 font-semibold" scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {workers
                  .filter(worker => activeFilter === 'All' || worker.status === activeFilter)
                  .map((worker, index) => (
                  <tr
                    key={index}
                    onClick={() => handleRowClick(worker)}
                    className="bg-white border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {worker.name}
                    </td>
                    <td className="px-6 py-4">{worker.tasks}</td>
                    <td className="px-6 py-4">${worker.totalSalary.toFixed(2)}</td>
                    <td className="px-6 py-4 text-green-500">
                      ${worker.bonus.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-red-500">
                      {worker.penalties > 0 ? `($${worker.penalties.toFixed(2)})` : '$0.00'}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ${calculateFinalSalary(worker.totalSalary, worker.bonus, worker.penalties).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`${getStatusBadgeClass(worker.status)} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                        {worker.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;