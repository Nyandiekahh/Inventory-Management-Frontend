import React from 'react';
import { 
  Store, BarChart3, Package, ShoppingCart, TrendingUp, 
  Users, Settings, FileText, CreditCard, User, Building
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { 
  SUPER_ADMIN_NAVIGATION, 
  STORE_ADMIN_NAVIGATION, 
  STORE_USER_NAVIGATION,
  USER_ROLES 
} from '../utils/constants';

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen }) => {
  const { currentUser, isSuperAdmin, isAdmin } = useAuth();
  const { currentStore } = useStore();

  const getIcon = (iconName) => {
    const icons = {
      BarChart3,
      Package,
      ShoppingCart,
      TrendingUp,
      Users,
      Store,
      Settings,
      FileText,
      Building,
      CreditCard,
      User
    };
    return icons[iconName] || BarChart3;
  };

  // Get navigation items based on user role
  const getNavigationItems = () => {
    if (isSuperAdmin()) {
      return SUPER_ADMIN_NAVIGATION;
    } else if (isAdmin()) {
      return STORE_ADMIN_NAVIGATION;
    } else {
      return STORE_USER_NAVIGATION;
    }
  };

  const navigationItems = getNavigationItems();

  // Get appropriate title based on user role
  const getTitle = () => {
    if (isSuperAdmin()) return 'System Admin';
    if (isAdmin()) return 'Store Admin';
    return 'POS Terminal';
  };

  // Get appropriate subtitle
  const getSubtitle = () => {
    if (isSuperAdmin()) return 'Multi-Store Management';
    if (currentStore) return currentStore.name;
    return 'Point of Sale';
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-40 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center gap-3">
          <Store className="w-8 h-8 flex-shrink-0" />
          {sidebarOpen && (
            <div className="min-w-0">
              <h2 className="font-bold text-lg truncate">InventoryPro</h2>
              <p className="text-blue-100 text-sm truncate">{getTitle()}</p>
            </div>
          )}
        </div>
        {sidebarOpen && (
          <div className="mt-2 text-xs text-blue-100 truncate">
            {getSubtitle()}
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="p-4 h-full overflow-y-auto pb-20">
        <div className="space-y-2">
          {navigationItems.map(item => {
            const Icon = getIcon(item.icon);
            const isActive = activeTab === item.id;
            const isReadonly = item.readonly && !isAdmin();
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                disabled={isReadonly}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-100 text-blue-700 shadow-sm' 
                    : isReadonly
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                }`}
                title={!sidebarOpen ? item.label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <div className="flex items-center justify-between w-full">
                    <span className="truncate">{item.label}</span>
                    {isReadonly && (
                      <span className="text-xs bg-gray-200 text-gray-600 px-1 rounded">
                        View
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Role indicator when sidebar is open */}
        {sidebarOpen && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gray-50 rounded-lg p-3 border">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  isSuperAdmin() ? 'bg-purple-500' : 
                  isAdmin() ? 'bg-blue-500' : 'bg-green-500'
                }`}></div>
                <span className="text-xs text-gray-600 truncate">
                  {currentUser?.name || 'User'}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {isSuperAdmin() ? 'Super Admin' : 
                 isAdmin() ? 'Store Admin' : 'Cashier'}
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;