import React from "react";
import PageHeader from "../../components/PageHeader";
import TaskForm from "../../components/TaskForm";

export default function WeeklyTaskPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader title="Create a New Task" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TaskForm />
          </div>

          <div>{/* Right side column (optional widgets) */}</div>
        </div>
      </main>
    </div>
  );
}
