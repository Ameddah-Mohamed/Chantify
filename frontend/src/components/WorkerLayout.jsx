// src/components/WorkerLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const WorkerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar en haut */}
      <Navbar />
      
      {/* Contenu principal */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default WorkerLayout;