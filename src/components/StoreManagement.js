import React, { useState } from 'react';
import { Plus, Settings, MapPin, Calendar, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { sampleData } from '../utils/constants';
import { useStore } from '../context/StoreContext';

const StoreManagement = () => {
  const { setCurrentStore } = useStore();
  const [stores] = useState(sampleData.stores);
  const [showAddStore, setShowAddStore] = useState(false);

  const handleManageStore = (store) => {
    setCurrentStore(store);
    alert(`Switched to managing ${store.name}. You can now manage products, users, and sales for this store.`);
  };

  const handleAddStore = () => {
    setShowAddStore(true);
  };

  const getStatusIcon = (status) => {
    return status === 'Active' ? CheckCircle : XCircle;
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'text-green-600' : 'text-red-600';
  };

  const getSubscriptionColor = (subscription) => {
    switch (subscription) {
      case 'Premium': return 'bg-purple-100 text-purple-800';
      case 'Standard': return 'bg-blue-100 text-blue-800';
      case 'Basic': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Store Management</h2>
          <p className="text-gray-600">Manage all stores and their subscriptions</p>
        </div>
        <button
          onClick={handleAddStore}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Store
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Stores</p>
              <p className="text-xl font-bold">{stores.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Stores</p>
              <p className="text-xl font-bold text-green-600">
                {stores.filter(s => s.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-full">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Premium Stores</p>
              <p className="text-xl font-bold text-purple-600">
                {stores.filter(s => s.subscription === 'Premium').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Expiring Soon</p>
              <p className="text-xl font-bold text-yellow-600">
                {stores.filter(s => isExpiringSoon(s.expiryDate)).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => {
          const StatusIcon = getStatusIcon(store.status);
          const expiringSoon = isExpiringSoon(store.expiryDate);
          const expired = isExpired(store.expiryDate);
          
          return (
            <div key={store.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              {/* Store Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{store.name}</h3>
                  <div className="flex items-center gap-1 text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{store.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <StatusIcon className={`w-5 h-5 ${getStatusColor(store.status)}`} />
                  <span className={`text-sm font-medium ${getStatusColor(store.status)}`}>
                    {store.status}
                  </span>
                </div>
              </div>
              
              {/* Store Details */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Subscription:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubscriptionColor(store.subscription)}`}>
                    {store.subscription}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Expires:</span>
                  <span className={`text-sm font-medium ${
                    expired ? 'text-red-600' : 
                    expiringSoon ? 'text-yellow-600' : 
                    'text-gray-900'
                  }`}>
                    {store.expiryDate}
                    {expiringSoon && !expired && (
                      <span className="ml-1 text-xs bg-yellow-100 text-yellow-800 px-1 rounded">
                        Soon
                      </span>
                    )}
                    {expired && (
                      <span className="ml-1 text-xs bg-red-100 text-red-800 px-1 rounded">
                        Expired
                      </span>
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Store ID:</span>
                  <span className="text-sm font-mono text-gray-900">#{store.id}</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <button 
                  onClick={() => handleManageStore(store)}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                >
                  Manage Store
                </button>
                <button 
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Store settings"
                >
                  <Settings className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              {/* Warning for expired/expiring subscriptions */}
              {(expired || expiringSoon) && (
                <div className={`mt-3 p-2 rounded-lg text-xs ${
                  expired ? 'bg-red-50 text-red-800' : 'bg-yellow-50 text-yellow-800'
                }`}>
                  {expired ? (
                    <>⚠️ Subscription expired! Renew to maintain access.</>
                  ) : (
                    <>⏰ Subscription expires soon. Consider renewing.</>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {stores.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Settings className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-500 font-medium">No stores found</p>
          <p className="text-sm text-gray-400">Add your first store to get started</p>
        </div>
      )}

      {/* Add Store Modal */}
      {showAddStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Add New Store</h3>
            <p className="text-gray-600 mb-4">
              Store creation form would be implemented here with fields for:
            </p>
            <ul className="text-sm text-gray-600 mb-4 space-y-1">
              <li>• Store name and location</li>
              <li>• Subscription plan selection</li>
              <li>• Contact information</li>
              <li>• Initial user setup</li>
            </ul>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowAddStore(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Create Store
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreManagement;