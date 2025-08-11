import React from 'react';
import { Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES } from '../utils/constants';

const LoginForm = () => {
  const { loginForm, setLoginForm, login } = useAuth();

  const handleLogin = () => {
    login(loginForm);
  };

  const handleInputChange = (field, value) => {
    setLoginForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
          <Store className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">InventoryPro</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">User Type</label>
            <select
              value={loginForm.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={USER_ROLES.STORE_ADMIN}>Store Admin</option>
              <option value={USER_ROLES.STORE_USER}>Store User</option>
              <option value={USER_ROLES.SUPER_ADMIN}>Super Admin</option>
            </select>
          </div>
          
          <input
            type="email"
            placeholder="Email"
            value={loginForm.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="mb-2">Demo Credentials:</p>
          <div className="space-y-1">
            <p><strong>Admin:</strong> john@naivas.com / password</p>
            <p><strong>User:</strong> mary@naivas.com / password</p>
            <p><strong>Super Admin:</strong> admin@inventorysystem.com / password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;