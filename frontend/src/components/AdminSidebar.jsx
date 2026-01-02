// src/components/AdminSidebar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2 } from 'lucide-react';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', path: '/manager/dashboard' },
    { id: 'workerRequests', icon: 'pending_actions', label: 'Worker Requests', path: '/manager/worker-requests' },
    { id: 'createTask', icon: 'add_task', label: 'Create Task', path: '/manager/create-task' }, 
    { id: 'workers', icon: 'group', label: 'Workers', path: '/manager/workers' },
    { id: 'taskApproval', icon: 'task_alt', label: 'Task Approval', path: '/manager/task-approval' },
    { id: 'jobTypes', icon: 'work', label: 'Job Types', path: '/manager/job-types' },
    { id: 'payments', icon: 'credit_card', label: 'Payments', path: '/manager/payments' },
    { id: 'profile', icon: 'account_circle', label: 'Profile', path: '/manager/profile' },
  ];

  const handleMenuClick = (path) => {
    navigate(path);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  const SidebarContent = () => (
    <div className="flex h-full flex-col justify-between">
      <div className="flex flex-col gap-6">
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-2">
          <div className="flex items-center justify-center w-10 h-10 bg-[#f3ae3f] rounded-full">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-lg font-bold">CHANTIFY</h1>
            <p className="text-gray-300 text-sm font-normal">Management Portal</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-2 overflow-y-auto flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.path)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-white/20 font-bold'
                  : 'hover:bg-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-white">{item.icon}</span>
              <p className="text-white text-sm">{item.label}</p>
            </button>
          ))}
        </nav>
      </div>

      {/* Logout Section */}
      <div className="pt-4 border-t border-white/20">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors w-full"
        >
          <span className="material-symbols-outlined text-white">logout</span>
          <p className="text-white text-sm">Logout</p>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger Button */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 w-10 h-10 bg-[#1e2987] text-white rounded-lg flex items-center justify-center md:hidden shadow-lg"
        >
          <span className="material-symbols-outlined">
            {isOpen ? 'close' : 'menu'}
          </span>
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0
          ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
          w-64 bg-[#1e2987] text-white p-4
          transition-transform duration-300 ease-in-out z-40
        `}
      >
        <SidebarContent />
      </aside>

      {/* Spacer for desktop (push content to the right) */}
      {!isMobile && <div className="w-64 flex-shrink-0" />}
    </>
  );
};

export default AdminSidebar;