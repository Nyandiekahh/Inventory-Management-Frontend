import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginForm from './components/LoginForm';
import AppLayout from './components/AppLayout';
import Dashboard from './components/Dashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import UserDashboard from './components/UserDashboard';
import ProductManagement from './components/ProductManagement';
import SalesComponent from './components/SalesComponent';
import PurchaseOrders from './components/PurchaseOrders';
import Reports from './components/Reports';
import UserManagement from './components/UserManagement';
import StoreManagement from './components/StoreManagement';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginForm />} />
                
                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                  {/* Super Admin Routes */}
                  <Route path="admin/dashboard" element={<ProtectedRoute role="superadmin"><SuperAdminDashboard /></ProtectedRoute>} />
                  <Route path="admin/stores" element={<ProtectedRoute role="superadmin"><StoreManagement /></ProtectedRoute>} />
                  <Route path="admin/analytics" element={<ProtectedRoute role="superadmin"><div>Global Analytics</div></ProtectedRoute>} />
                  <Route path="admin/subscriptions" element={<ProtectedRoute role="superadmin"><div>Subscriptions</div></ProtectedRoute>} />
                  <Route path="admin/users" element={<ProtectedRoute role="superadmin"><UserManagement /></ProtectedRoute>} />
                  <Route path="admin/settings" element={<ProtectedRoute role="superadmin"><div>System Settings</div></ProtectedRoute>} />
                  
                  {/* Store Admin Routes */}
                  <Route path="store/dashboard" element={<ProtectedRoute role="admin"><Dashboard /></ProtectedRoute>} />
                  <Route path="store/products" element={<ProtectedRoute role="admin"><ProductManagement /></ProtectedRoute>} />
                  <Route path="store/sales" element={<ProtectedRoute role="admin"><SalesComponent /></ProtectedRoute>} />
                  <Route path="store/purchase-orders" element={<ProtectedRoute role="admin"><PurchaseOrders /></ProtectedRoute>} />
                  <Route path="store/inventory" element={<ProtectedRoute role="admin"><div>Inventory Management</div></ProtectedRoute>} />
                  <Route path="store/reports" element={<ProtectedRoute role="admin"><Reports /></ProtectedRoute>} />
                  <Route path="store/users" element={<ProtectedRoute role="admin"><UserManagement /></ProtectedRoute>} />
                  <Route path="store/settings" element={<ProtectedRoute role="admin"><div>Store Settings</div></ProtectedRoute>} />
                  
                  {/* Cashier/User Routes */}
                  <Route path="pos/dashboard" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
                  <Route path="pos/sales" element={<ProtectedRoute role="user"><SalesComponent /></ProtectedRoute>} />
                  <Route path="pos/products" element={<ProtectedRoute role="user"><ProductManagement readonly /></ProtectedRoute>} />
                  <Route path="pos/my-sales" element={<ProtectedRoute role="user"><div>My Sales History</div></ProtectedRoute>} />
                  <Route path="pos/profile" element={<ProtectedRoute role="user"><div>My Profile</div></ProtectedRoute>} />
                  
                  {/* Default Redirects */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardRedirect />} />
                </Route>
                
                {/* Catch all */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
}

// Component to redirect to appropriate dashboard based on role
const DashboardRedirect = () => {
  const { isSuperAdmin, isAdmin } = useAuth();
  
  if (isSuperAdmin()) {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (isAdmin()) {
    return <Navigate to="/store/dashboard" replace />;
  } else {
    return <Navigate to="/pos/dashboard" replace />;
  }
};

export default App;