import React, { useState } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';

const AdminPasswordPrompt = ({ onAuthorize, onCancel }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    // In a real app, you'd validate the password against the backend
    if (password.trim()) {
      onAuthorize();
      setPassword('');
      setError('');
    } else {
      setError('Please enter the admin password');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-100 rounded-full">
            <Shield className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Admin Authorization Required
          </h3>
        </div>
        
        <p className="text-gray-600 mb-4">
          This action requires admin approval. Please enter the admin password to continue.
        </p>
        
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className={`w-full p-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
            }`}
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        
        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}
        
        <div className="flex gap-3">
          <button 
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Authorize
          </button>
          <button 
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Demo:</strong> Any password will work for demonstration purposes
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPasswordPrompt;