import React, { useState, useEffect } from 'react';
import { Store, Eye, EyeOff, Loader2, AlertCircle, User, Mail, Lock, Phone, Shield, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

const LoginForm = () => {
  // Mock auth context - replace with your actual useAuth hook
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: 'cashier'
  });
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '', details: '' });
  const [validationErrors, setValidationErrors] = useState({});

  // Mock login/register functions - replace with your actual functions
  const login = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    return { success: true, user: { email: loginForm.email, role: 'admin' } };
  };

  const register = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    setLoading(false);
    return { success: true, user: { email: registerForm.email, role: registerForm.role } };
  };

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: '', text: '', details: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    return phone.startsWith('+254') && phone.length === 13 && /^\+254\d{9}$/.test(phone);
  };

  const getDetailedErrorMessage = (error, isRegistration = false) => {
    const errorMap = {
      'auth/user-not-found': {
        text: 'Account not found',
        details: 'No account exists with this email address. Please check your email or create a new account.'
      },
      'auth/wrong-password': {
        text: 'Incorrect password',
        details: 'The password you entered is incorrect. Please try again.'
      },
      'auth/invalid-email': {
        text: 'Invalid email address',
        details: 'Please enter a valid email address.'
      },
      'auth/email-already-in-use': {
        text: 'Email already registered',
        details: 'An account with this email already exists. Try signing in instead.'
      },
      'auth/weak-password': {
        text: 'Password too weak',
        details: 'Password must be at least 6 characters long.'
      },
      'auth/too-many-requests': {
        text: 'Too many attempts',
        details: 'Please wait a few minutes before trying again.'
      },
      'auth/network-request-failed': {
        text: 'Connection error',
        details: 'Please check your internet connection and try again.'
      }
    };

    for (const [key, value] of Object.entries(errorMap)) {
      if (error.includes(key)) return value;
    }

    return {
      text: isRegistration ? 'Registration failed' : 'Login failed',
      details: error || 'An unexpected error occurred. Please try again.'
    };
  };

  const validateRegistrationForm = () => {
    const errors = {};
    
    if (!registerForm.firstName.trim()) errors.firstName = 'First name is required';
    if (!registerForm.lastName.trim()) errors.lastName = 'Last name is required';
    if (!registerForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(registerForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!registerForm.password) {
      errors.password = 'Password is required';
    } else if (registerForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    if (!registerForm.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhone(registerForm.phone)) {
      errors.phone = 'Phone number must be in format +254XXXXXXXXX';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateLoginForm = () => {
    const errors = {};
    
    if (!loginForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(loginForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!loginForm.password) errors.password = 'Password is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLoginForm()) return;
    
    setMessage({ type: '', text: '', details: '' });
    const result = await login();
    
    if (result.success) {
      setMessage({ 
        type: 'success', 
        text: 'Welcome back!', 
        details: 'You have been successfully authenticated.' 
      });
    } else {
      const errorMsg = getDetailedErrorMessage(result.error, false);
      setMessage({ type: 'error', ...errorMsg });
    }
  };

  const handleRegister = async () => {
    if (!validateRegistrationForm()) return;
    
    setMessage({ type: '', text: '', details: '' });
    const result = await register();
    
    if (result.success) {
      setMessage({ 
        type: 'success', 
        text: 'Account created successfully!', 
        details: `Welcome! Your ${registerForm.role} account has been created.` 
      });
    } else {
      const errorMsg = getDetailedErrorMessage(result.error, true);
      setMessage({ type: 'error', ...errorMsg });
    }
  };

  const handleInputChange = (form, field, value) => {
    if (form === 'login') {
      setLoginForm(prev => ({ ...prev, [field]: value }));
    } else {
      setRegisterForm(prev => ({ ...prev, [field]: value }));
    }
    
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setMessage({ type: '', text: '', details: '' });
    setValidationErrors({});
  };

  const getInputClassName = (fieldName) => {
    const baseClass = "w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300 bg-white placeholder-gray-400";
    return validationErrors[fieldName] ? 
      `${baseClass} border-red-300 focus:ring-red-100 focus:border-red-400` : 
      baseClass;
  };

  const roles = [
    { value: 'cashier', label: 'Cashier', icon: '🏪', desc: 'Handle sales and transactions' },
    { value: 'manager', label: 'Manager', icon: '👨‍💼', desc: 'Manage inventory and staff' },
    { value: 'admin', label: 'Admin', icon: '⚡', desc: 'Full system access' }
  ];

  if (isLoggedIn && currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Store className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">InventoryPro</h2>
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 relative">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              InventoryPro
            </h1>
            <p className="text-gray-600 text-sm">
              {isRegistering ? 'Create your account' : 'Sign in to continue'}
            </p>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-xl border transition-all duration-300 ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {message.type === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{message.text}</h4>
                  {message.details && (
                    <p className="text-xs mt-1 opacity-90">{message.details}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Forms */}
          <div className="space-y-5">
            {isRegistering && (
              <>
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="First name"
                      value={registerForm.firstName}
                      onChange={(e) => handleInputChange('register', 'firstName', e.target.value)}
                      className={getInputClassName('firstName')}
                      disabled={loading}
                    />
                    {validationErrors.firstName && (
                      <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.firstName}</p>
                    )}
                  </div>
                  <div className="relative">
                    <User className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Last name"
                      value={registerForm.lastName}
                      onChange={(e) => handleInputChange('register', 'lastName', e.target.value)}
                      className={getInputClassName('lastName')}
                      disabled={loading}
                    />
                    {validationErrors.lastName && (
                      <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="relative">
                  <Phone className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="+254712345678"
                    value={registerForm.phone}
                    onChange={(e) => handleInputChange('register', 'phone', e.target.value)}
                    className={getInputClassName('phone')}
                    disabled={loading}
                  />
                  {validationErrors.phone && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.phone}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1 ml-1">Kenya format: +254XXXXXXXXX</p>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select your role
                  </label>
                  <div className="space-y-3">
                    {roles.map((role) => (
                      <label
                        key={role.value}
                        className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                          registerForm.role === role.value
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role.value}
                          checked={registerForm.role === role.value}
                          onChange={(e) => handleInputChange('register', 'role', e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-3 w-full">
                          <span className="text-xl">{role.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{role.label}</div>
                            <div className="text-xs text-gray-600">{role.desc}</div>
                          </div>
                          {registerForm.role === role.value && (
                            <CheckCircle className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email"
                value={isRegistering ? registerForm.email : loginForm.email}
                onChange={(e) => handleInputChange(isRegistering ? 'register' : 'login', 'email', e.target.value)}
                className={getInputClassName('email')}
                disabled={loading}
                autoComplete="email"
              />
              {validationErrors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={isRegistering ? registerForm.password : loginForm.password}
                onChange={(e) => handleInputChange(isRegistering ? 'register' : 'login', 'password', e.target.value)}
                className={`${getInputClassName('password')} pr-12`}
                disabled={loading}
                autoComplete={isRegistering ? "new-password" : "current-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {validationErrors.password && (
                <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.password}</p>
              )}
              {isRegistering && (
                <p className="text-xs text-gray-500 mt-1 ml-1">Minimum 6 characters required</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={isRegistering ? handleRegister : handleLogin}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>
                    {isRegistering ? 'Creating account...' : 'Signing in...'}
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {isRegistering ? 'Create Account' : 'Sign In'}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Loading Progress */}
            {loading && (
              <div className="text-center">
                <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  {isRegistering ? 'Setting up your account...' : 'Authenticating...'}
                </p>
              </div>
            )}
          </div>

          {/* Toggle Mode */}
          <div className="mt-8 text-center">
            <button 
              onClick={toggleMode}
              disabled={loading}
              className="text-gray-600 hover:text-blue-600 text-sm font-medium disabled:opacity-50 transition-colors"
            >
              {isRegistering 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Create one"
              }
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Your data is protected with enterprise-grade security</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            © 2025 InventoryPro - Professional Inventory Management
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;