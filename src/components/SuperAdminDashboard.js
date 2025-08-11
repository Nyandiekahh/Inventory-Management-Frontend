import React from 'react';
import { Store, Users, CreditCard, TrendingUp, AlertTriangle, MapPin } from 'lucide-react';
import { sampleData } from '../utils/constants';

const SuperAdminDashboard = () => {
  const stores = sampleData.stores;
  const allUsers = sampleData.users;
  
  // Calculate system-wide metrics
  const totalStores = stores.length;
  const activeStores = stores.filter(s => s.status === 'Active').length;
  const totalUsers = allUsers.length;
  const premiumStores = stores.filter(s => s.subscription === 'Premium').length;
  
  // Calculate revenue (simulation)
  const monthlyRevenue = stores.reduce((sum, store) => {
    const price = store.subscription === 'Premium' ? 5000 : 2500;
    return sum + price;
  }, 0);

  const StatCard = ({ title, value, icon: Icon, color = "blue", subtitle }) => {
    const colorClasses = {
      blue: "text-blue-600 bg-blue-100",
      green: "text-green-600 bg-green-100",
      purple: "text-purple-600 bg-purple-100",
      orange: "text-orange-600 bg-orange-100",
      red: "text-red-600 bg-red-100"
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-gray-600 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">System Administrator Dashboard</h1>
        <p className="text-blue-100">Welcome to the InventoryPro management console</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Stores"
          value={totalStores}
          icon={Store}
          color="blue"
          subtitle={`${activeStores} active`}
        />
        
        <StatCard
          title="Monthly Revenue"
          value={`KSh ${monthlyRevenue.toLocaleString()}`}
          icon={CreditCard}
          color="green"
          subtitle="Subscription fees"
        />
        
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          color="purple"
          subtitle="Across all stores"
        />
        
        <StatCard
          title="Premium Stores"
          value={premiumStores}
          icon={TrendingUp}
          color="orange"
          subtitle={`${Math.round((premiumStores/totalStores)*100)}% of total`}
        />
      </div>

      {/* Store Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Store className="w-5 h-5 text-blue-600" />
            Store Status Overview
          </h3>
          <div className="space-y-4">
            {stores.map(store => {
              const isExpiring = new Date(store.expiryDate) - new Date() < 30 * 24 * 60 * 60 * 1000;
              return (
                <div key={store.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{store.name}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      store.subscription === 'Premium' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {store.subscription}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isExpiring && (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" title="Expiring soon" />
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      store.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {store.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Recent System Activity
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-800">New Store Registration</p>
                <p className="text-sm text-green-600">Naivas Westlands - Premium Plan</p>
              </div>
              <span className="text-xs text-green-600">2 days ago</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-blue-800">Payment Received</p>
                <p className="text-sm text-blue-600">Tuskys Mombasa - KSh 2,500</p>
              </div>
              <span className="text-xs text-blue-600">3 days ago</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="font-medium text-orange-800">Support Ticket</p>
                <p className="text-sm text-orange-600">Barcode scanner issue</p>
              </div>
              <span className="text-xs text-orange-600">5 days ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group">
            <Store className="w-6 h-6 text-blue-500 mx-auto mb-2 group-hover:text-blue-600" />
            <p className="text-sm text-blue-600 font-medium">Add New Store</p>
          </button>
          
          <button className="p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors group">
            <CreditCard className="w-6 h-6 text-green-500 mx-auto mb-2 group-hover:text-green-600" />
            <p className="text-sm text-green-600 font-medium">View Payments</p>
          </button>
          
          <button className="p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors group">
            <Users className="w-6 h-6 text-purple-500 mx-auto mb-2 group-hover:text-purple-600" />
            <p className="text-sm text-purple-600 font-medium">Manage Users</p>
          </button>
          
          <button className="p-4 border-2 border-dashed border-orange-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors group">
            <TrendingUp className="w-6 h-6 text-orange-500 mx-auto mb-2 group-hover:text-orange-600" />
            <p className="text-sm text-orange-600 font-medium">View Analytics</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;