import React from 'react';
import { 
  Store, BarChart3, Package, ShoppingCart, TrendingUp, 
  Users, Settings 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { NAVIGATION_ITEMS } from '../utils/constants';

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen }) => {
  const { isSuperAdmin } = useAuth();
  const { currentStore } = useStore();

  const getIcon = (iconName) => {
    const icons = {
      BarChart3,
      Package,
      ShoppingCart,
      TrendingUp,
      Users,
      Store,
      Settings
    };
    return icons[iconName] || BarChart3;
  };

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} min-h-screen`}>
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Store className="w-8 h-8 text-blue-600" />
          {sidebarOpen && (
            <div>
              <h2 className="font-bold text-lg">InventoryPro</h2>
              {currentStore && (
                <p className="text-sm text-gray-600">{currentStore.name}</p>
              )}
            </div>
          )}
        </div>
      </div>
      
      <nav className="p-4">
        <div className="space-y-2">
          {NAVIGATION_ITEMS.map(item => {
            // Hide super admin only items for regular users
            if (item.superAdminOnly && !isSuperAdmin()) {
              return null;
            }
            
            const Icon = getIcon(item.icon);
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                title={!sidebarOpen ? item.label : ''}
              >
                <Icon className="w-5 h-5" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;