import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, role }) => {
  const { isLoggedIn, currentUser, loading, getUserRole } = useAuth();
  const location = useLocation();

  // Show loading spinner while determining auth state
  if (loading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If no specific role required, just check if logged in
  if (!role) {
    return children;
  }

  // Get user's role from backend
  const userRole = currentUser?.role?.toLowerCase();
  
  console.log(`🛡️ ProtectedRoute: user="${userRole}" vs required="${role}"`);

  // Check role-based access with hierarchical permissions
  const hasAccess = () => {
    switch (role) {
      case 'admin':
        // Only actual admin role can access admin routes
        return userRole === 'admin';
        
      case 'manager':
        // Admin and manager can access store management routes
        return userRole === 'admin' || userRole === 'manager';
        
      case 'cashier':
        // All roles can access cashier features (hierarchical access)
        return userRole === 'admin' || userRole === 'manager' || userRole === 'cashier';
        
      default:
        console.warn(`🛡️ Unknown role requirement: ${role}`);
        return false;
    }
  };

  // If user doesn't have required role, redirect to their appropriate dashboard
  if (!hasAccess()) {
    console.log(`🚫 Access denied. Redirecting ${userRole} user to appropriate dashboard`);
    
    switch (userRole) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'manager':
        return <Navigate to="/store/dashboard" replace />;
      case 'cashier':
        return <Navigate to="/pos/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  console.log(`✅ Access granted for ${userRole} to ${role} route`);
  return children;
};

export default ProtectedRoute;