import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

const RouterHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const { currentUser, logout } = useAuth();
  const { currentStore } = useStore();
  const location = useLocation();

  const getPageTitle = (pathname) => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    const titles = {
      // Super Admin
      'dashboard': 'Dashboard',
      'stores': 'Store Management',
      'analytics': 'Global Analytics',
      'subscriptions': 'Subscription Management',
      'users': 'User Management',
      'settings': 'Settings',
      
      // Store Admin
      'products': 'Product Management',
      'sales': 'Sales & POS',
      'purchase-orders': 'Purchase Orders',
      'inventory': 'Inventory Management',
      'reports': 'Reports & Analytics',
      
      // Cashier/User
      'my-sales': 'My Sales History',
      'profile': 'My Profile'
    };
    
    return titles[lastSegment] || 'Dashboard';
  };

  return (
    <div className="bg-white shadow-sm border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">
          {getPageTitle(location.pathname)}
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        {currentStore && (
          <div className="text-sm hidden md:block">
            <span className="text-gray-600">Store: </span>
            <span className="font-medium text-gray-800">{currentStore.name}</span>
          </div>
        )}
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-800">{currentUser?.name}</p>
            <p className="text-xs text-gray-600">{currentUser?.role || currentUser?.email}</p>
          </div>
          
          <button 
            onClick={logout}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouterHeader;