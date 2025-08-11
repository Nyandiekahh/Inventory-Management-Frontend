import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { isLoggedIn, isSuperAdmin, isAdmin } = useAuth();
  const location = useLocation();

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If no specific role required, just check if logged in
  if (!role) {
    return children;
  }

  // Check role-based access
  const hasAccess = () => {
    switch (role) {
      case 'superadmin':
        return isSuperAdmin();
      case 'admin':
        return isAdmin();
      case 'user':
        return !isAdmin(); // Store users/cashiers
      default:
        return false;
    }
  };

  // If user doesn't have required role, redirect to their appropriate dashboard
  if (!hasAccess()) {
    if (isSuperAdmin()) {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (isAdmin()) {
      return <Navigate to="/store/dashboard" replace />;
    } else {
      return <Navigate to="/pos/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;