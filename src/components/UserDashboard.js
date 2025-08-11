import React from 'react';
import { ShoppingCart, Package, Clock, TrendingUp, User, CheckCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';

const UserDashboard = () => {
  const { products, salesHistory, currentStore } = useStore();
  const { currentUser } = useAuth();
  
  // Calculate user-specific metrics
  const todayDate = new Date().toISOString().split('T')[0];
  const mySalesToday = salesHistory.filter(sale => 
    sale.cashier === currentUser?.name && sale.date === todayDate
  );
  
  const myTotalSales = mySalesToday.reduce((sum, sale) => sum + sale.total, 0);
  const myTransactionCount = mySalesToday.length;
  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  
  // Get my recent sales
  const myRecentSales = salesHistory
    .filter(sale => sale.cashier === currentUser?.name)
    .slice(0, 5);

  const QuickStatCard = ({ title, value, icon: Icon, color = "blue", subtitle }) => {
    const colorClasses = {
      blue: "text-blue-600 bg-blue-100",
      green: "text-green-600 bg-green-100",
      orange: "text-orange-600 bg-orange-100",
      purple: "text-purple-600 bg-purple-100"
    };

    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
      </div>
    );
  };

  const getCurrentShift = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning Shift";
    if (hour < 18) return "Afternoon Shift";
    return "Evening Shift";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              Welcome back, {currentUser?.name?.split(' ')[0] || 'User'}! 👋
            </h1>
            <p className="text-green-100">
              {currentStore?.name} • {getCurrentShift()} • {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
              <span className="text-sm font-medium">Cashier</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStatCard
          title="Today's Sales"
          value={`KSh ${myTotalSales.toLocaleString()}`}
          icon={TrendingUp}
          color="green"
          subtitle={`${myTransactionCount} transactions`}
        />
        
        <QuickStatCard
          title="Transactions"
          value={myTransactionCount}
          icon={ShoppingCart}
          color="blue"
          subtitle="Completed today"
        />
        
        <QuickStatCard
          title="Available Products"
          value={products.filter(p => p.stock > 0).length}
          icon={Package}
          color="purple"
          subtitle="In stock"
        />
        
        <QuickStatCard
          title="Low Stock Items"
          value={lowStockCount}
          icon={Clock}
          color="orange"
          subtitle="Need attention"
        />
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-3">
              <ShoppingCart className="w-5 h-5" />
              Start New Sale
            </button>
            
            <button className="w-full bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-3">
              <Package className="w-5 h-5" />
              Check Product Stock
            </button>
            
            <button className="w-full bg-gray-600 text-white p-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-3">
              <User className="w-5 h-5" />
              My Profile
            </button>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            My Recent Sales
          </h3>
          
          {myRecentSales.length > 0 ? (
            <div className="space-y-3">
              {myRecentSales.map(sale => (
                <div key={sale.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Sale #{sale.id}</p>
                    <p className="text-sm text-gray-600">
                      {sale.date} at {sale.time} • {sale.items.length} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">KSh {sale.total.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No sales yet today</p>
              <p className="text-sm">Start your first transaction!</p>
            </div>
          )}
        </div>
      </div>

      {/* Tips and Reminders */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">💡 Today's Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs font-medium">TIP</span>
            <p className="text-blue-800">Use the barcode scanner for faster checkout</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs font-medium">REMINDER</span>
            <p className="text-green-800">Check for low stock items before your shift ends</p>
          </div>
          {lowStockCount > 0 && (
            <div className="flex items-start gap-2 md:col-span-2">
              <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs font-medium">ALERT</span>
              <p className="text-orange-800">
                {lowStockCount} item(s) are running low on stock. Inform your manager.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="font-semibold text-lg mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{myTotalSales.toLocaleString()}</p>
            <p className="text-sm text-gray-600">KSh Sales Today</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{myTransactionCount}</p>
            <p className="text-sm text-gray-600">Transactions Completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {myTransactionCount > 0 ? Math.round(myTotalSales / myTransactionCount) : 0}
            </p>
            <p className="text-sm text-gray-600">Avg. Sale Amount</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;