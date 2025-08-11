import React, { createContext, useContext, useState } from 'react';
import { sampleData, USER_ROLES } from '../utils/constants';

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
  const [loginForm, setLoginForm] = useState({ 
    email: '', 
    password: '', 
    role: USER_ROLES.STORE_ADMIN 
  });

  const login = (credentials) => {
    // Simulate login - replace with actual API call later
    if (credentials.email && credentials.password) {
      if (credentials.role === USER_ROLES.SUPER_ADMIN) {
        setCurrentUser(sampleData.superAdmin);
      } else {
        // For demo, use first user
        setCurrentUser(sampleData.users[0]);
      }
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setLoginForm({ email: '', password: '', role: USER_ROLES.STORE_ADMIN });
  };

  const isAdmin = () => {
    return currentUser?.role === 'Admin' || currentUser?.name === 'System Administrator';
  };

  const isSuperAdmin = () => {
    return currentUser?.name === 'System Administrator';
  };

  const hasPermission = (permission) => {
    if (isAdmin()) return true;
    return currentUser?.permissions?.includes(permission) || false;
  };

  const value = {
    isLoggedIn,
    currentUser,
    loginForm,
    setLoginForm,
    login,
    logout,
    isAdmin,
    isSuperAdmin,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};