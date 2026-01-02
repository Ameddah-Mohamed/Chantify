// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f3ae3f]"></div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Check role if required
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate page based on role
    if (user.role === 'admin') {
      return <Navigate to="/manager/dashboard" replace />;
    } else {
      return <Navigate to="/tasks" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;