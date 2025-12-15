
import React, { useState } from 'react';
import Sidebar from './components/AdminSidebar';
import Dashboard from './pages/manager/Dashboard';
import Workers from './pages/manager/Workers';
import TaskApproval from './pages/manager/TaskApproval';
import JobTypes from './pages/manager/JobTypes';
import Payments from './pages/manager/Payments';
import PaymentDetails from './pages/manager/PaymentDetails';
import Settings from './pages/manager/Settings';

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedWorker, setSelectedWorker] = useState(null);

  const handleViewDetails = (worker) => {
    setSelectedWorker(worker);
  };

  const handleBackToPayments = () => {
    setSelectedWorker(null);
  };

  const renderPage = () => {
    // If we're on payments page and a worker is selected, show payment details
    if (currentPage === 'payments' && selectedWorker) {
      return <PaymentDetails worker={selectedWorker} onBack={handleBackToPayments} />;
    }

    // Otherwise show the regular page
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'workers':
        return <Workers />;
      case 'taskApproval':
        return <TaskApproval />;
      case 'jobTypes':
        return <JobTypes />;
      case 'payments':
        return <Payments onViewDetails={handleViewDetails} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-white">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
    </div>
  );
};

export default App;