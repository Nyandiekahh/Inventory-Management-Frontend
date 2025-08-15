// src/components/AuthTest.js
import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

const AuthTest = () => {
  const { currentUser, authToken, isLoggedIn, getAuthToken, refreshUserData } = useAuth();
  const [apiTest, setApiTest] = useState({ status: 'idle', message: '' });
  const [loading, setLoading] = useState(false);

  const testApiConnection = async () => {
    setLoading(true);
    setApiTest({ status: 'testing', message: 'Testing API connection...' });
    
    try {
      // Test basic API connection
      const connectionTest = await apiService.testConnection();
      
      if (!connectionTest.success) {
        setApiTest({ 
          status: 'error', 
          message: 'API connection failed. Check if backend is running.' 
        });
        return;
      }

      // Test authenticated request
      const userTest = await apiService.getCurrentUser();
      
      if (userTest.success) {
        setApiTest({ 
          status: 'success', 
          message: 'API connection successful! Authentication working.' 
        });
      } else {
        setApiTest({ 
          status: 'warning', 
          message: `API connected but auth failed: ${userTest.error}` 
        });
      }
    } catch (error) {
      setApiTest({ 
        status: 'error', 
        message: `Test failed: ${error.message}` 
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    setLoading(true);
    try {
      const newToken = await getAuthToken();
      if (newToken) {
        setApiTest({ status: 'success', message: 'Token refreshed successfully' });
        await refreshUserData();
      } else {
        setApiTest({ status: 'error', message: 'Failed to refresh token' });
      }
    } catch (error) {
      setApiTest({ status: 'error', message: `Token refresh failed: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'testing': return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'testing': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-6">Authentication Status</h2>
        
        {/* Authentication Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Authentication State</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {isLoggedIn ? 
                  <CheckCircle className="w-4 h-4 text-green-600" /> : 
                  <XCircle className="w-4 h-4 text-red-600" />
                }
                <span className={`text-sm ${isLoggedIn ? 'text-green-600' : 'text-red-600'}`}>
                  {isLoggedIn ? 'Logged In' : 'Not Logged In'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {authToken ? 
                  <CheckCircle className="w-4 h-4 text-green-600" /> : 
                  <XCircle className="w-4 h-4 text-red-600" />
                }
                <span className={`text-sm ${authToken ? 'text-green-600' : 'text-red-600'}`}>
                  {authToken ? 'Token Available' : 'No Token'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">User Information</h3>
            {currentUser ? (
              <div className="space-y-1 text-sm">
                <p><strong>UID:</strong> {currentUser.uid}</p>
                <p><strong>Email:</strong> {currentUser.email}</p>
                <p><strong>Role:</strong> {currentUser.role || 'Unknown'}</p>
                <p><strong>Name:</strong> {currentUser.firstName} {currentUser.lastName}</p>
                {currentUser.phone && <p><strong>Phone:</strong> {currentUser.phone}</p>}
                {currentUser.branchId && <p><strong>Branch ID:</strong> {currentUser.branchId}</p>}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No user data available</p>
            )}
          </div>
        </div>

        {/* Token Information */}
        {authToken && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Authentication Token</h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs font-mono break-all text-gray-600">
                {authToken.substring(0, 50)}...
              </p>
            </div>
          </div>
        )}

        {/* API Test Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">API Connection Test</h3>
            <div className="flex gap-2">
              <button
                onClick={testApiConnection}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                {loading ? 'Testing...' : 'Test API'}
              </button>
              <button
                onClick={refreshToken}
                disabled={loading || !isLoggedIn}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 text-sm"
              >
                Refresh Token
              </button>
            </div>
          </div>

          {apiTest.status !== 'idle' && (
            <div className={`p-3 rounded-lg border ${getStatusColor(apiTest.status)}`}>
              <div className="flex items-center gap-2">
                {getStatusIcon(apiTest.status)}
                <span className="text-sm font-medium">{apiTest.message}</span>
              </div>
            </div>
          )}
        </div>

        {/* Environment Info */}
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-medium text-gray-900 mb-2">Environment Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>API Base URL:</strong></p>
              <p className="text-gray-600 break-all">{process.env.REACT_APP_API_BASE_URL}</p>
            </div>
            <div>
              <p><strong>Firebase Project:</strong></p>
              <p className="text-gray-600">{process.env.REACT_APP_FIREBASE_PROJECT_ID}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;