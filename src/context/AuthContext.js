// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);
  
  // Form state for login/registration
  const [loginForm, setLoginForm] = useState({ 
    email: '', 
    password: ''
  });
  
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '+254', // Pre-fill with Kenya code
    role: 'cashier',
    branchId: '123' // Default branch - will be updated based on backend data
  });

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
      
      if (firebaseUser) {
        try {
          // Get fresh token and user details
          const token = await firebaseUser.getIdToken();
          const userDetails = await authService.getCurrentUserDetails(token);
          
          setAuthToken(token);
          
          if (userDetails.success) {
            // Use backend user details
            const userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...userDetails.user
            };
            
            setCurrentUser(userData);
          } else {
            // Don't set user if we can't get backend details
            console.error('Failed to get user details from backend - user not authenticated');
            await authService.logout(); // Logout if we can't get user data
            return;
          }
          
          setIsLoggedIn(true);
          
          // Store in localStorage for persistence
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_data', JSON.stringify({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            ...(userDetails.success ? userDetails.user : {})
          }));
          
        } catch (error) {
          console.error('Error setting up user session:', error);
          setCurrentUser(null);
          setIsLoggedIn(false);
          setAuthToken(null);
        }
      } else {
        // User is signed out
        setCurrentUser(null);
        setIsLoggedIn(false);
        setAuthToken(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Register new user
   */
  const register = async (userData = registerForm) => {
    try {
      setLoading(true);
      console.log('📝 Attempting to register user:', userData.email);
      
      const result = await authService.register(userData);
      
      if (result.success) {
        console.log('✅ Registration successful');
        // Clear form
        setRegisterForm({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          phone: '+254',
          role: 'cashier',
          branchId: '123'
        });
        return { success: true, message: 'Registration successful' };
      } else {
        console.error('❌ Registration failed:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('💥 Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user
   */
  const login = async (credentials = loginForm) => {
    try {
      setLoading(true);
      console.log('🔐 Attempting to login user:', credentials.email);
      
      const result = await authService.login(credentials.email, credentials.password);
      
      if (result.success) {
        console.log('✅ Login successful');
        // Clear form
        setLoginForm({ email: '', password: '' });
        return { success: true, message: 'Login successful' };
      } else {
        console.error('❌ Login failed:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('💥 Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      setLoading(true);
      const result = await authService.logout();
      
      if (result.success) {
        console.log('✅ Logout successful');
        return { success: true };
      } else {
        console.error('❌ Logout failed:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('💥 Logout error:', error);
      return { success: false, error: 'Logout failed' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get current authentication token
   */
  const getAuthToken = async () => {
    try {
      return await authService.getCurrentToken();
    } catch (error) {
      console.error('❌ Error getting auth token:', error);
      return null;
    }
  };

  /**
   * Check if user has specific role
   */
  const hasRole = (role) => {
    const userRole = currentUser?.role?.toLowerCase();
    const checkRole = role?.toLowerCase();
    return userRole === checkRole;
  };

  /**
   * Check if user is admin (based on backend roles)
   * Backend roles: "admin", "manager", "cashier"
   */
  const isAdmin = () => {
    const userRole = currentUser?.role?.toLowerCase();
    return userRole === 'admin' || userRole === 'manager';
  };

  /**
   * Check if user is super admin
   * For now, treating 'admin' as super admin since no 'superadmin' role exists in backend
   */
  const isSuperAdmin = () => {
    const userRole = currentUser?.role?.toLowerCase();
    return userRole === 'admin';
  };

  /**
   * Check if user is cashier/user
   */
  const isCashier = () => {
    const userRole = currentUser?.role?.toLowerCase();
    return userRole === 'cashier';
  };

  /**
   * Get user's role for debugging
   */
  const getUserRole = () => {
    return currentUser?.role || 'none';
  };

  /**
   * Refresh user data from backend
   */
  const refreshUserData = async () => {
    if (!authToken) return;
    
    try {
      const userDetails = await authService.getCurrentUserDetails(authToken);
      if (userDetails.success) {
        setCurrentUser(prev => ({
          ...prev,
          ...userDetails.user
        }));
      }
    } catch (error) {
      console.error('❌ Error refreshing user data:', error);
    }
  };

  const value = {
    // State
    isLoggedIn,
    currentUser,
    loading,
    authToken,
    
    // Forms
    loginForm,
    setLoginForm,
    registerForm,
    setRegisterForm,
    
    // Actions
    login,
    register,
    logout,
    getAuthToken,
    refreshUserData,
    
    // Role checks (FIXED)
    hasRole,
    isAdmin,
    isSuperAdmin,
    isCashier,
    getUserRole,
    
    // Utilities
    isAuthenticated: authService.isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};