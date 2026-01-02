// src/components/AdminLayout.jsx
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar'; // Votre sidebar admin

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar à gauche */}
      <AdminSidebar />
      
      {/* Contenu principal */}
      <div className="flex-1">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;