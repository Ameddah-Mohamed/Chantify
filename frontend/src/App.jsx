// import { useState } from 'react'


// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <h3>This is the main app, you can put your component here to see, i will implement routing later for everything to be clean</h3>
//       <h4>(remove all this this after reading)</h4>
//     </>
//   )
// }

// export default App

import React, { useState } from 'react';
import Sidebar from './components/AdminSidebar';
import Dashboard from './pages/Admin/Dashboard';
import CreateTask from './pages/Admin/CreateTask';
import Workers from './pages/Admin/Workers';
import TaskApproval from './pages/Admin/TaskApproval';
import JobTypes from './pages/Admin/JobTypes';
import Payments from './pages/Admin/Payments';
import PaymentDetails from './pages/Admin/PaymentDetails';
import Settings from './pages/Admin/Settings';

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
      case 'createTask':
        return <CreateTask />;
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