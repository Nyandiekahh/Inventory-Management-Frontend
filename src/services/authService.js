// src/services/authService.js
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

class AuthService {
  /**
   * Register new user using backend API
   * Backend creates Firebase user and adds to database
   */
  async register(userData) {
    try {
      console.log('Registering user with backend:', userData);
      
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: userData.password,
          role: userData.role || 'cashier',
          phone: userData.phone, // Must be E.164 format: +254XXXXXXXXX
          branchId: userData.branchId || '123', // Default branch
          status: 'active'
        })
      });

      const result = await response.json();
      console.log('Backend signup response:', result);
      
      if (response.ok) {
        // After successful registration, login the user with Firebase
        console.log('Backend signup successful, logging in with Firebase...');
        return await this.login(userData.email, userData.password);
      } else {
        console.error('Backend signup failed:', result);
        return {
          success: false,
          error: result.error || result.message || 'Registration failed'
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.message || 'Network error during registration'
      };
    }
  }

  /**
   * Login user directly with Firebase (backend login is broken)
   * Get Firebase token for backend API calls
   */
  async login(email, password) {
    try {
      console.log('Logging in with Firebase:', email);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      
      console.log('Firebase login successful:', user.uid);
      
      // Get user details from backend using the token
      const userDetails = await this.getCurrentUserDetails(token);
      
      if (userDetails.success) {
        return {
          success: true,
          user: {
            uid: user.uid,
            email: user.email,
            ...userDetails.user
          },
          token
        };
      } else {
        // If backend call fails, still return basic Firebase user info
        console.warn('Could not fetch user details from backend, using Firebase data only');
        return {
          success: true,
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            phoneNumber: user.phoneNumber
          },
          token
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: this.getFirebaseErrorMessage(error.code)
      };
    }
  }

  /**
   * Get current user details from backend
   */
  async getCurrentUserDetails(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const user = await response.json();
        return { success: true, user };
      } else {
        console.warn('Could not fetch user details from backend');
        return { success: false };
      }
    } catch (error) {
      console.warn('Error fetching user details:', error);
      return { success: false };
    }
  }

  /**
   * Logout user from Firebase
   */
  async logout() {
    try {
      await signOut(auth);
      // Clear any stored tokens
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      console.log('Logout successful');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get current user's Firebase token
   */
  async getCurrentToken() {
    const user = auth.currentUser;
    if (user) {
      try {
        return await user.getIdToken(true); // Force refresh
      } catch (error) {
        console.error('Error getting token:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Listen for authentication state changes
   */
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Get user-friendly error messages for Firebase errors
   */
  getFirebaseErrorMessage(errorCode) {
    const errorMessages = {
      'auth/user-not-found': 'No account found with this email address',
      'auth/wrong-password': 'Incorrect password',
      'auth/email-already-in-use': 'An account with this email already exists',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/invalid-email': 'Invalid email address',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later',
      'auth/network-request-failed': 'Network error. Please check your connection'
    };
    
    return errorMessages[errorCode] || 'An authentication error occurred';
  }

  /**
   * Check if user is logged in
   */
  isAuthenticated() {
    return !!auth.currentUser;
  }

  /**
   * Get current Firebase user
   */
  getCurrentUser() {
    return auth.currentUser;
  }
}

// Create singleton instance
export const authService = new AuthService();
export default authService;