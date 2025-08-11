import React from 'react';
import { Download, TrendingUp, DollarSign, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Reports = () => {
  const { products, salesHistory, getTotalInventoryValue, getTodaySales } = useStore();

  const exportData = (type) => {
    // In a real app, this would generate and download files
    alert(`Exporting ${type} data...`);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
        <p className="text-gray-600">View business insights and export data</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Sales Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Today's Sales:</span>
              <span className="font-bold">KSh {getTodaySales().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>This Week:</span>
              <span className="font-bold">KSh 2,840</span>
            </div>
            <div className="flex justify-between">
              <span>This Month:</span>
              <span className="font-bold">KSh 12,450</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-green-600" />
            Inventory Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Products:</span>
              <span className="font-bold">{products.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Low Stock Items:</span>
              <span className="font-bold text-red-600">
                {products.filter(p => p.stock <= p.minStock).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Inventory Value:</span>
              <span className="font-bold">KSh {getTotalInventoryValue().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Export Reports</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => exportData('sales')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Sales
            </button>
            <button 
              onClick={() => exportData('inventory')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Inventory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;