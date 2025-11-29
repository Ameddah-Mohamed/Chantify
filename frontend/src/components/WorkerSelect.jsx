import React, { useState } from "react";

export default function WorkerSelect() {
  const [open, setOpen] = useState(false);

  const workers = [
    { name: "John Doe", img: "https://lh3.googleusercontent.com/aida-public/..." },
    { name: "Jane Smith", img: "https://lh3.googleusercontent.com/aida-public/..." },
    { name: "Mike Johnson", img: "https://lh3.googleusercontent.com/aida-public/..." },
    { name: "Emily Williams", img: "https://lh3.googleusercontent.com/aida-public/..." },
  ];

  return (
    <div className="relative">
      <label className="block text-base font-medium pb-2">Assign Workers</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between h-14 p-[15px] rounded-lg border border-slate-300 bg-slate-50 dark:bg-slate-800"
      >
        <span className="text-slate-400">Select one or more workers</span>
        <span className="material-symbols-outlined">expand_more</span>
      </button>

      {open && (
        <div className="absolute top-full mt-2 w-full z-20 bg-white dark:bg-slate-800 border rounded-lg shadow-lg">
          <div className="p-2 border-b">
            <input
              type="search"
              placeholder="Search workers..."
              className="form-input w-full rounded-md bg-slate-100 dark:bg-slate-700"
            />
          </div>

          <ul className="max-h-60 overflow-y-auto p-2 space-y-1">
            {workers.map((w, i) => (
              <li
                key={i}
                className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md cursor-pointer"
              >
                <input type="checkbox" className="form-checkbox text-primary" />
                <img src={w.img} className="h-8 w-8 rounded-full object-cover" />
                <span className="text-sm font-medium">{w.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}