import React from "react";
import WorkerSelect from "./WorkerSelect";

export default function TaskForm() {
  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm max-w-3xl mx-auto my-8">
      <form className="space-y-6">
        {/* Task Title */}
        <div>
          <label className="block pb-2 font-medium text-gray-700">Task Title</label>
          <input
            type="text"
            placeholder="Enter a short, descriptive title"
            className="w-full h-14 px-4 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block pb-2 font-medium text-gray-700">Description</label>
          <textarea
            rows="5"
            placeholder="Add a detailed description for the task"
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition resize-none"
          />
        </div>

        {/* Deadline + Worker Select */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block pb-2 font-medium text-gray-700">Deadline</label>
            <input
              type="date"
              className="w-full h-14 px-4 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>

          <WorkerSelect />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            className="h-12 px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition"
          >
            Clear Form
          </button>
          <button
            type="submit"
            className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
}
