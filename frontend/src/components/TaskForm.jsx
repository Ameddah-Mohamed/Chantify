import React from "react";
import WorkerSelect from "./WorkerSelect";

export default function TaskForm() {
  return (
    <div className="bg-white dark:bg-slate-900/70 p-8 rounded-xl border shadow-sm">
      <form className="space-y-6">
        {/* Task Title */}
        <div>
          <label className="block pb-2 font-medium">Task Title</label>
          <input
            type="text"
            placeholder="Enter a short, descriptive title"
            className="form-input w-full h-14 rounded-lg bg-slate-50 dark:bg-slate-800"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block pb-2 font-medium">Description</label>
          <textarea
            rows="5"
            placeholder="Add a detailed description for the task"
            className="form-textarea w-full rounded-lg bg-slate-50 dark:bg-slate-800"
          />
        </div>

        {/* Deadline + Worker Select */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block pb-2 font-medium">Deadline</label>
            <input
              type="date"
              className="form-input w-full h-14 rounded-lg bg-slate-50 dark:bg-slate-800"
            />
          </div>

          <WorkerSelect />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            className="h-12 px-6 BG-slate-200 dark:bg-slate-700 rounded-lg font-bold"
          >
            Clear Form
          </button>
          <button
            type="submit"
            className="h-12 px-6 bg-primary text-white rounded-lg font-bold"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
}
