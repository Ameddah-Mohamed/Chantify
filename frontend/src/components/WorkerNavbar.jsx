import React from 'react';
import { useNavigate } from 'react-router-dom';

const WorkerNavbar = ({ title = "Weekly Tasks" }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-[#1e2987] rounded-full">
                <svg fill="none" viewBox="0 0 48 48" className="w-5 h-5 text-[#f3ae3f]" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
                </svg>
              </div>
              <div className="flex flex-col">
                <h1 className="text-[#1e2987] text-lg font-bold">CHANTIFY</h1>
              </div>
            </div>
            <div className="h-6 w-px bg-gray-300 mx-2"></div>
            <h2 className="text-gray-900 text-lg font-semibold">{title}</h2>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {/* Profile Button */}
            <div className="relative">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-sm font-medium">W</span>
                </div>
                <span className="text-gray-700 text-sm font-medium">Worker</span>
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                // Handle logout
                navigate('/auth/signin');
              }}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default WorkerNavbar;