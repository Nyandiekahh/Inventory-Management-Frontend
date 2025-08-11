import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginForm from './LoginForm';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './Dashboard';
import ProductManagement from './ProductManagement';
import SalesComponent from './SalesComponent';
import PurchaseOrders from './PurchaseOrders';
import Reports from './Reports';
import UserManagement from './UserManagement';
import StoreManagement from './StoreManagement';
import AdminPasswordPrompt from './AdminPasswordPrompt';

const MainLayout = () => {
  const { isLoggedIn, isAdmin } = useAuth();
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
    switch (activeTab) {
      case 'dashboard': 
        return <Dashboard />;
      case 'products': 
        return <ProductManagement requireAdminAuth={requireAdminAuth} />;
      case 'sales': 
        return <SalesComponent requireAdminAuth={requireAdminAuth} />;
      case 'purchase': 
        return <PurchaseOrders requireAdminAuth={requireAdminAuth} />;
      case 'reports': 
        return <Reports />;
      case 'users': 
        return <UserManagement requireAdminAuth={requireAdminAuth} />;
      case 'stores': 
        return <StoreManagement />;
      case 'settings': 
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Settings</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <p>Settings panel - store preferences, system configuration, etc.</p>
            </div>
          </div>
        );
      default: 
        return <Dashboard />;
    }
  };

  if (!isLoggedIn) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
      />
      
      <div className="flex-1 flex flex-col">
        <Header 
          activeTab={activeTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto">
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