// src/components/PublicRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f3ae3f]"></div>
      </div>
    );
  }

  // If authenticated, redirect based on role
  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/manager/dashboard" replace />;
    } else {
      return <Navigate to="/worker/weekly" replace />;
    }
  }

  return children;
};

export default PublicRoute;