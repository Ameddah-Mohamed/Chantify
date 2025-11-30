import React, { useState } from 'react';
import { dummyData } from '../../data/dummyData';

const Workers = () => {
  const [workers] = useState(dummyData.workers);
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredWorkers = statusFilter === 'All' 
    ? workers 
    : workers.filter(w => w.status === statusFilter);

  return (
    <div className="flex-1 p-8 bg-[#f8f7f5] overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-black text-[#181511] mb-2">Workers Management</h1>
            <p className="text-[#8a7a60] text-base">Oversee and manage company workers</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#1e2987] text-white rounded-lg font-bold hover:bg-[#1a2475] transition-colors">
            <span className="material-symbols-outlined">add</span>
            <span>Add Worker</span>
          </button>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm font-medium text-[#8a7a60]">Status:</span>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border-0 bg-white py-2.5 px-4 text-[#181511] text-sm font-medium ring-1 ring-inset ring-[#e6e2db] focus:ring-2 focus:ring-[#1e2987]"
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-[#e6e2db] overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-[#e6e2db]">
              <tr className="bg-white">
                <th className="px-6 py-4 text-left text-[#8a7a60] text-xs font-medium uppercase">Name</th>
                <th className="px-6 py-4 text-left text-[#8a7a60] text-xs font-medium uppercase">Job Type</th>
                <th className="px-6 py-4 text-left text-[#8a7a60] text-xs font-medium uppercase">Total Salary</th>
                <th className="px-6 py-4 text-left text-[#8a7a60] text-xs font-medium uppercase">Status</th>
                <th className="px-6 py-4 text-right text-[#8a7a60] text-xs font-medium uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.map((worker) => (
                <tr key={worker.id} className="border-t border-[#e6e2db] hover:bg-[#f8f7f5]">
                  <td className="px-6 py-4 text-[#181511] text-sm font-medium">{worker.name}</td>
                  <td className="px-6 py-4 text-[#8a7a60] text-sm">{worker.jobType}</td>
                  <td className="px-6 py-4 text-[#8a7a60] text-sm">${worker.salary.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                      worker.status === 'Active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        worker.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></span>
                      {worker.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#f8f7f5] hover:bg-[#f3ae3f]/20">
                        <span className="material-symbols-outlined text-lg">visibility</span>
                      </button>
                      <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#f8f7f5] hover:bg-[#f3ae3f]/20">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#f8f7f5] hover:bg-[#f3ae3f]/20">
                        <span className="material-symbols-outlined text-lg">
                          {worker.status === 'Active' ? 'toggle_off' : 'toggle_on'}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Workers;