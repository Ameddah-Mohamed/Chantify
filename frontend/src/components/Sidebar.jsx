import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', path: '/manager/dashboard' },
    { id: 'workers', icon: 'group', label: 'Workers', path: '/manager/workers' },
    { id: 'taskApproval', icon: 'task_alt', label: 'Task Approval', path: '/manager/task-approval' },
    { id: 'jobTypes', icon: 'work', label: 'Job Types', path: '/manager/job-types' },
    { id: 'payments', icon: 'credit_card', label: 'Payments', path: '/manager/payments' },
    { id: 'settings', icon: 'settings', label: 'Settings', path: '/manager/settings' },
  ];

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      navigate('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/signin');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="flex w-64 flex-col bg-white text-gray-900 p-4 min-h-screen border-r border-gray-200">
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col gap-6">
          {/* Logo Section */}
          <div className="flex items-center gap-3 px-2">
            <div className="flex items-center justify-center w-10 h-10 bg-[#f3ae3f] rounded-full">
              <svg fill="none" viewBox="0 0 48 48" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-gray-900 text-lg font-bold">CHANTIFY</h1>
              <p className="text-gray-500 text-sm font-normal">Management Portal</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-[#f3ae3f] text-white font-bold'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span className={`material-symbols-outlined ${
                  isActive(item.path) ? 'text-white' : 'text-gray-700'
                }`}>{item.icon}</span>
                <p className={`text-sm ${
                  isActive(item.path) ? 'text-white' : 'text-gray-700'
                }`}>{item.label}</p>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout Section */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors w-full text-gray-700"
          >
            <span className="material-symbols-outlined text-gray-700">logout</span>
            <p className="text-gray-700 text-sm">Logout</p>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;