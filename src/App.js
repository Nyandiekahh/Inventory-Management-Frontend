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
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

// Main App Component
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// App Content Component (needs to be inside AuthProvider)
function AppContent() {
  const { loading, isLoggedIn } = useAuth();

  // Show loading spinner while authentication is being determined
  if (loading) {
    return <LoadingSpinner message="Initializing application..." />;
  }

  return (
    <StoreProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes - Only show login if NOT logged in */}
              <Route 
                path="/login" 
                element={
                  isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginForm />
                } 
              />
              
              {/* Protected Routes - Only accessible if logged in */}
              <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                
                {/* ADMIN ROUTES - Backend role: "admin" */}
                <Route path="admin/dashboard" element={<ProtectedRoute role="admin"><SuperAdminDashboard /></ProtectedRoute>} />
                <Route path="admin/stores" element={<ProtectedRoute role="admin"><StoreManagement /></ProtectedRoute>} />
                <Route path="admin/analytics" element={<ProtectedRoute role="admin"><div className="p-6"><h2 className="text-xl font-semibold">Global Analytics</h2><p>System-wide analytics dashboard</p></div></ProtectedRoute>} />
                <Route path="admin/subscriptions" element={<ProtectedRoute role="admin"><div className="p-6"><h2 className="text-xl font-semibold">Subscriptions</h2><p>Subscription management</p></div></ProtectedRoute>} />
                <Route path="admin/users" element={<ProtectedRoute role="admin"><UserManagement /></ProtectedRoute>} />
                <Route path="admin/settings" element={<ProtectedRoute role="admin"><div className="p-6"><h2 className="text-xl font-semibold">System Settings</h2><p>Global system configuration</p></div></ProtectedRoute>} />
                
                {/* STORE ROUTES - Backend roles: "admin" and "manager" */}
                <Route path="store/dashboard" element={<ProtectedRoute role="manager"><Dashboard /></ProtectedRoute>} />
                <Route path="store/products" element={<ProtectedRoute role="manager"><ProductManagement /></ProtectedRoute>} />
                <Route path="store/sales" element={<ProtectedRoute role="manager"><SalesComponent /></ProtectedRoute>} />
                <Route path="store/purchase-orders" element={<ProtectedRoute role="manager"><PurchaseOrders /></ProtectedRoute>} />
                <Route path="store/inventory" element={<ProtectedRoute role="manager"><div className="p-6"><h2 className="text-xl font-semibold">Inventory Management</h2><p>Advanced inventory features</p></div></ProtectedRoute>} />
                <Route path="store/reports" element={<ProtectedRoute role="manager"><Reports /></ProtectedRoute>} />
                <Route path="store/users" element={<ProtectedRoute role="manager"><UserManagement /></ProtectedRoute>} />
                <Route path="store/settings" element={<ProtectedRoute role="manager"><div className="p-6"><h2 className="text-xl font-semibold">Store Settings</h2><p>Store configuration</p></div></ProtectedRoute>} />
                
                {/* CASHIER ROUTES - Backend role: "cashier" */}
                <Route path="pos/dashboard" element={<ProtectedRoute role="cashier"><UserDashboard /></ProtectedRoute>} />
                <Route path="pos/sales" element={<ProtectedRoute role="cashier"><SalesComponent /></ProtectedRoute>} />
                <Route path="pos/products" element={<ProtectedRoute role="cashier"><ProductManagement readonly /></ProtectedRoute>} />
                <Route path="pos/my-sales" element={<ProtectedRoute role="cashier"><div className="p-6"><h2 className="text-xl font-semibold">My Sales History</h2><p>Your personal sales records</p></div></ProtectedRoute>} />
                <Route path="pos/profile" element={<ProtectedRoute role="cashier"><div className="p-6"><h2 className="text-xl font-semibold">My Profile</h2><p>Personal profile settings</p></div></ProtectedRoute>} />
                
                {/* Default Redirects */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardRedirect />} />
              </Route>
              
              {/* Catch all - redirect to login if not authenticated, dashboard if authenticated */}
              <Route 
                path="*" 
                element={
                  isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
                } 
              />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </StoreProvider>
  );
}

// Component to redirect to appropriate dashboard based on role
const DashboardRedirect = () => {
  const { currentUser } = useAuth();
  
  const userRole = currentUser?.role?.toLowerCase();
  
  // Map backend roles to frontend routes
  switch (userRole) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'manager':
      return <Navigate to="/store/dashboard" replace />;
    case 'cashier':
      return <Navigate to="/pos/dashboard" replace />;
    default:
      return <Navigate to="/pos/dashboard" replace />;
  }
};

export default App;