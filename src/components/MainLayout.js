import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginForm from './LoginForm';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './Dashboard';
import SuperAdminDashboard from './SuperAdminDashboard';
import UserDashboard from './UserDashboard';
import ProductManagement from './ProductManagement';
import SalesComponent from './SalesComponent';
import PurchaseOrders from './PurchaseOrders';
import Reports from './Reports';
import UserManagement from './UserManagement';
import StoreManagement from './StoreManagement';
import AdminPasswordPrompt from './AdminPasswordPrompt';

const MainLayout = () => {
  const { isLoggedIn, isAdmin, isSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

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

  const renderContent = () => {
    // Super Admin specific pages
    if (isSuperAdmin()) {
      switch (activeTab) {
        case 'dashboard': 
          return <SuperAdminDashboard />;
        case 'stores': 
          return <StoreManagement />;
        case 'analytics':
          return (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Global Analytics</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <p>Global analytics dashboard - showing metrics across all stores</p>
              </div>
            </div>
          );
        case 'subscriptions':
          return (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Subscription Management</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <p>Subscription management - billing, renewals, plan changes</p>
              </div>
            </div>
          );
        case 'system-users':
          return <UserManagement requireAdminAuth={requireAdminAuth} />;
        case 'settings':
          return (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">System Settings</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <p>Global system configuration and settings</p>
              </div>
            </div>
          );
        default: 
          return <SuperAdminDashboard />;
      }
    }

    // Store Admin pages
    if (isAdmin()) {
      switch (activeTab) {
        case 'dashboard': 
          return <Dashboard />;
        case 'products': 
          return <ProductManagement requireAdminAuth={requireAdminAuth} />;
        case 'sales': 
          return <SalesComponent requireAdminAuth={requireAdminAuth} />;
        case 'purchase': 
          return <PurchaseOrders requireAdminAuth={requireAdminAuth} />;
        case 'inventory':
          return (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Inventory Management</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <p>Advanced inventory features - stock adjustments, transfers, audits</p>
              </div>
            </div>
          );
        case 'reports': 
          return <Reports />;
        case 'users': 
          return <UserManagement requireAdminAuth={requireAdminAuth} />;
        case 'settings':
          return (
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Store Settings</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <p>Store-specific settings - preferences, configurations, etc.</p>
              </div>
            </div>
          );
        default: 
          return <Dashboard />;
      }
    }

    // Store User (Cashier) pages
    switch (activeTab) {
      case 'dashboard': 
        return <UserDashboard />;
      case 'sales': 
        return <SalesComponent requireAdminAuth={requireAdminAuth} />;
      case 'products': 
        return (
          <div className="p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800">
                <strong>View Only:</strong> You can view product information but cannot make changes.
              </p>
            </div>
            <ProductManagement requireAdminAuth={requireAdminAuth} />
          </div>
        );
      case 'my-sales':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">My Sales History</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <p>Your personal sales history and performance metrics</p>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">My Profile</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <p>Personal profile settings and preferences</p>
            </div>
          </div>
        );
      default: 
        return <UserDashboard />;
    }
  };

  if (!isLoggedIn) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
      />
      
      {/* Main content area with margin for fixed sidebar */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Header 
          activeTab={activeTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main className="min-h-screen">
          {renderContent()}
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

export default MainLayout;