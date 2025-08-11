import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RouterSidebar from './RouterSidebar';
import RouterHeader from './RouterHeader';
import AdminPasswordPrompt from './AdminPasswordPrompt';

const AppLayout = () => {
  const { isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const location = useLocation();

  const requireAdminAuth = (action) => {
    if (isAdmin()) {
      action();
    } else {
      setPendingAction(action);
      setShowPasswordPrompt(true);
    }
  };

  const handleAdminAuth = () => {
    setShowPasswordPrompt(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleAdminAuthCancel = () => {
    setShowPasswordPrompt(false);
    setPendingAction(null);
  };

  // Get current page from URL
  const getCurrentPage = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    return pathSegments[pathSegments.length - 1] || 'dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <RouterSidebar 
        sidebarOpen={sidebarOpen}
        currentPage={getCurrentPage()}
      />
      
      {/* Main content area with margin for fixed sidebar */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <RouterHeader 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentPage={getCurrentPage()}
        />
        <main className="min-h-screen">
          {/* Outlet renders the matched child route */}
          <Outlet context={{ requireAdminAuth }} />
        </main>
      </div>
      
      {showPasswordPrompt && (
        <AdminPasswordPrompt 
          onAuthorize={handleAdminAuth}
          onCancel={handleAdminAuthCancel}
        />
      )}
    </div>
  );
};

export default AppLayout;