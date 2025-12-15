import React, { useState } from "react";

export default function WorkerSelect() {
  const [open, setOpen] = useState(false);

  const workers = [
    { name: "John Doe", img: "https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff" },
    { name: "Jane Smith", img: "https://ui-avatars.com/api/?name=Jane+Smith&background=10b981&color=fff" },
    { name: "Mike Johnson", img: "https://ui-avatars.com/api/?name=Mike+Johnson&background=f59e0b&color=fff" },
    { name: "Emily Williams", img: "https://ui-avatars.com/api/?name=Emily+Williams&background=8b5cf6&color=fff" },
  ];

  return (
    <div className="relative">
      <label className="block text-base font-medium text-gray-700 pb-2">Assign Workers</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between h-14 px-4 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 transition focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
      >
        <span className="text-gray-500">Select one or more workers</span>
        <span className="material-symbols-outlined text-gray-400">expand_more</span>
      </button>

      {open && (
        <div className="absolute top-full mt-2 w-full z-20 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-2 border-b border-gray-200">
            <input
              type="search"
              placeholder="Search workers..."
              className="w-full px-3 py-2 rounded-md bg-gray-50 border border-gray-300 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            />
          </div>

          <ul className="max-h-60 overflow-y-auto p-2 space-y-1">
            {workers.map((w, i) => (
              <li
                key={i}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer transition"
              >
                <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <img src={w.img} className="h-8 w-8 rounded-full object-cover bg-gray-200" />
                <span className="text-sm font-medium text-gray-900">{w.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}