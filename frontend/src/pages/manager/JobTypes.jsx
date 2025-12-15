import React, { useState } from 'react';
import { dummyData } from '../../data/dummyData';

const JobTypes = () => {
  const [jobTypes] = useState(dummyData.jobTypes);

  return (
    <div className="flex-1 p-8 bg-[#f8f7f5] overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-black text-[#181511] mb-2">Job Types Management</h1>
            <p className="text-[#8a7a60] text-base">Add, edit, or delete job types and their base salaries</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#1e2987] text-white rounded-lg font-bold hover:bg-[#1a2475] transition-colors">
            <span className="material-symbols-outlined">add</span>
            <span>Add Job Type</span>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-[#e6e2db] overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-[#e6e2db]">
              <tr className="bg-white">
                <th className="px-6 py-4 text-left text-[#8a7a60] text-sm font-medium">Job Type Name</th>
                <th className="px-6 py-4 text-left text-[#8a7a60] text-sm font-medium">Base Salary</th>
                <th className="px-6 py-4 text-left text-[#8a7a60] text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobTypes.map((jobType) => (
                <tr key={jobType.id} className="border-t border-[#e6e2db] hover:bg-[#f8f7f5]">
                  <td className="px-6 py-4 text-[#181511] text-sm">{jobType.name}</td>
                  <td className="px-6 py-4 text-[#8a7a60] text-sm">${jobType.baseSalary.toFixed(2)}/hr</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#f3ae3f]/20 text-[#f3ae3f]">
                        <span className="material-symbols-outlined text-xl">edit</span>
                      </button>
                      <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-red-500">
                        <span className="material-symbols-outlined text-xl">delete</span>
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

export default JobTypes;