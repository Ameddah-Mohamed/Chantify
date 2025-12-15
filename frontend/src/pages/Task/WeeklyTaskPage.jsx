import React from "react";
import WorkerNavbar from "../../components/WorkerNavbar";
import PageHeader from "../../components/PageHeader";
import TaskForm from "../../components/TaskForm";

export default function WeeklyTaskPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <WorkerNavbar title="Create Task" />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-4xl">
          <PageHeader title="Create a New Task" />
          <TaskForm />
        </div>
      </main>
    </div>
  );
}
