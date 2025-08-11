import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';

const Header = ({ activeTab, sidebarOpen, setSidebarOpen }) => {
  const { currentUser, logout } = useAuth();
  const { currentStore } = useStore();

  const getPageTitle = (tab) => {
    const titles = {
      dashboard: 'Dashboard',
      products: 'Product Management',
      sales: 'Sales & POS',
      purchase: 'Purchase Orders',
      reports: 'Reports & Analytics',
      users: 'User Management',
      stores: 'Store Management',
      settings: 'Settings'
    };
    return titles[tab] || 'Dashboard';
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
          {getPageTitle(activeTab)}
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

export default Header;