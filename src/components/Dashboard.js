import React from 'react';
import { Package, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Dashboard = () => {
  const { 
    products, 
    salesHistory, 
    getLowStockItems, 
    getTotalInventoryValue, 
    getTodaySales 
  } = useStore();

  const lowStockItems = getLowStockItems();
  const totalProducts = products.length;
  const totalValue = getTotalInventoryValue();
  const todaySales = getTodaySales();

  const StatCard = ({ title, value, icon: Icon, color = "blue" }) => {
    const colorClasses = {
      blue: "text-blue-600",
      green: "text-green-600",
      red: "text-red-600"
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <Icon className={`w-8 h-8 ${colorClasses[color]}`} />
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          color="blue"
        />
        
        <StatCard
          title="Inventory Value"
          value={`KSh ${totalValue.toLocaleString()}`}
          icon={DollarSign}
          color="green"
        />
        
        <StatCard
          title="Today's Sales"
          value={`KSh ${todaySales.toLocaleString()}`}
          icon={TrendingUp}
          color="blue"
        />
        
        <StatCard
          title="Low Stock Items"
          value={lowStockItems.length}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Low Stock Alerts</h3>
          </div>
          <div className="space-y-2">
            {lowStockItems.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="text-red-700 font-medium">{item.name}</span>
                <span className="text-red-600">
                  Stock: {item.stock} (Min: {item.minStock})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold mb-4">Recent Sales</h3>
          <div className="space-y-3">
            {salesHistory.slice(0, 5).map(sale => (
              <div key={sale.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Sale #{sale.id}</p>
                  <p className="text-sm text-gray-600">{sale.date} {sale.time}</p>
                  <p className="text-xs text-gray-500">{sale.items.length} items</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">KSh {sale.total}</p>
                  <p className="text-xs text-gray-500">{sale.cashier}</p>
                </div>
              </div>
            ))}
            {salesHistory.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent sales</p>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold mb-4">Inventory Overview</h3>
          <div className="space-y-3">
            {products.slice(0, 5).map(product => (
              <div key={product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    product.stock <= product.minStock ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    Stock: {product.stock}
                  </p>
                  <p className="text-sm text-gray-600">KSh {product.price}</p>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <p className="text-gray-500 text-center py-4">No products available</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
            <Package className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Add Product</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
            <TrendingUp className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">New Sale</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
            <DollarSign className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Purchase Order</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors">
            <AlertTriangle className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">View Reports</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;