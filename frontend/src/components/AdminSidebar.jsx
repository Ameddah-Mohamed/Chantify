import React, { useState, useEffect } from 'react';

const Sidebar = ({ currentPage, setCurrentPage }) => {
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
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'createTask', icon: 'add_task', label: 'Create Task' },
    { id: 'workers', icon: 'group', label: 'Workers' },
    { id: 'taskApproval', icon: 'task_alt', label: 'Task Approval' },
    { id: 'jobTypes', icon: 'work', label: 'Job Types' },
    { id: 'payments', icon: 'credit_card', label: 'Payments' },
    { id: 'settings', icon: 'settings', label: 'Settings' },
  ];

  const handleMenuClick = (id) => {
    setCurrentPage(id);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const SidebarContent = () => (
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
            <h1 className="text-white text-lg font-bold">CHANTIFY</h1>
            <p className="text-gray-300 text-sm font-normal">Management Portal</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                currentPage === item.id
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
          onClick={() => console.log('Logout clicked')}
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
          ${isMobile ? 'fixed' : 'relative'}
          ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
          w-64 bg-[#1e2987] text-white p-4 min-h-screen
          transition-transform duration-300 ease-in-out z-40
          ${isMobile ? 'top-0 left-0 bottom-0' : ''}
        `}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;