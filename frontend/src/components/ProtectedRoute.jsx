// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole, requireApproved = false, allowPending = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

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
      return <Navigate to="/pending-approval" replace />;
    }
  }

  // Allow pending users to access /pending-approval page
  if (location.pathname === '/pending-approval' && allowPending) {
    return children;
  }

  // For worker routes, check if user is approved (unless specifically allowed pending)
  if (user.role === 'worker' && requireApproved) {
    if (user.applicationStatus === 'pending') {
      return <Navigate to="/pending-approval" replace />;
    }
    if (user.applicationStatus === 'rejected') {
      return <Navigate to="/signin" replace />;
    }
  }

  // For worker routes without requireApproved flag, still block pending users from functional pages
  if (user.role === 'worker' && requiredRole === 'worker' && !allowPending) {
    if (user.applicationStatus === 'pending') {
      return <Navigate to="/pending-approval" replace />;
    }
    if (user.applicationStatus === 'rejected') {
      return <Navigate to="/signin" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;