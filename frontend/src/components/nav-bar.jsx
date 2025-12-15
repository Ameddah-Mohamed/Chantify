import React from "react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between whitespace-nowrap px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-4 text-slate-900 dark:text-white">
          <svg className="h-8 w-8 text-primary" viewBox="0 0 48 48" fill="none">
            <path
              d="M39.5563 34.1455V13.8546..."
              fill="currentColor"
            />
          </svg>
          <h2 className="text-xl font-bold">ConstructPro</h2>
        </div>

        <div className="flex flex-1 justify-end items-center gap-6">
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a className="hover:text-primary">Dashboard</a>
            <a className="hover:text-primary">Workers</a>
            <a className="hover:text-primary">Projects</a>
            <a className="hover:text-primary">Reports</a>
            <a className="hover:text-primary">Settings</a>
          </nav>

          <div className="flex items-center gap-2">
            <button className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>
            <button className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">help</span>
            </button>
          </div>

          <div
            className="h-10 w-10 rounded-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/...')",
            }}
          />
        </div>
      </div>
    </header>
  );
}