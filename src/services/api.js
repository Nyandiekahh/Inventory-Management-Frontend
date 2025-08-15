// src/services/api.js
import { authService } from './authService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Get authenticated headers for API requests
   */
  async getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (includeAuth) {
      const token = await authService.getCurrentToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Make authenticated API request
   */
  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers = await this.getHeaders(options.auth !== false);
      
      const config = {
        ...options,
        headers: {
          ...headers,
          ...options.headers
        }
      };

      console.log(`API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      
      // Handle different response types
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log(`API Response: ${response.status}`, data);

      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return { success: true, data, status: response.status };
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      return { 
        success: false, 
        error: error.message,
        status: error.status || 500
      };
    }
  }

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  /**
   * PATCH request (backend uses PATCH, not PUT)
   */
  async patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body)
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  // === AUTHENTICATION ENDPOINTS ===
  
  /**
   * Register new user (no auth required)
   */
  async register(userData) {
    return this.post('/auth/signup', userData, { auth: false });
  }

  /**
   * Get current user details
   */
  async getCurrentUser() {
    return this.get('/users/me');
  }

  // === USER MANAGEMENT ===
  
  /**
   * Get all users
   */
  async getUsers() {
    return this.get('/users');
  }

  /**
   * Get user by ID
   */
  async getUser(userId) {
    return this.get(`/users/${userId}`);
  }

  /**
   * Create new user
   */
  async createUser(userData) {
    return this.post('/users', userData);
  }

  /**
   * Update user
   */
  async updateUser(userId, userData) {
    return this.patch(`/users/${userId}`, userData);
  }

  /**
   * Delete user
   */
  async deleteUser(userId) {
    return this.delete(`/users/${userId}`);
  }

  // === PRODUCT MANAGEMENT ===
  
  /**
   * Get all products
   */
  async getProducts() {
    return this.get('/products');
  }

  /**
   * Create new product
   */
  async createProduct(productData) {
    return this.post('/products', productData);
  }

  /**
   * Update product
   */
  async updateProduct(productId, productData) {
    return this.patch(`/products/${productId}`, productData);
  }

  /**
   * Delete product
   */
  async deleteProduct(productId) {
    return this.delete(`/products/${productId}`);
  }

  // === SALES MANAGEMENT ===
  
  /**
   * Get all sales
   */
  async getSales() {
    return this.get('/sales');
  }

  /**
   * Create new sale
   */
  async createSale(saleData) {
    return this.post('/sales', saleData);
  }

  // === BRANCH MANAGEMENT ===
  
  /**
   * Get all branches
   */
  async getBranches() {
    return this.get('/branches');
  }

  /**
   * Create new branch
   */
  async createBranch(branchData) {
    return this.post('/branches', branchData);
  }

  /**
   * Update branch
   */
  async updateBranch(branchId, branchData) {
    return this.patch(`/branches/${branchId}`, branchData);
  }

  /**
   * Delete branch
   */
  async deleteBranch(branchId) {
    return this.delete(`/branches/${branchId}`);
  }

  // === DISCOUNT MANAGEMENT ===
  
  /**
   * Get all discounts
   */
  async getDiscounts() {
    return this.get('/discounts');
  }

  /**
   * Create new discount
   */
  async createDiscount(discountData) {
    return this.post('/discounts', discountData);
  }

  /**
   * Update discount
   */
  async updateDiscount(discountId, discountData) {
    return this.patch(`/discounts/${discountId}`, discountData);
  }

  /**
   * Delete discount
   */
  async deleteDiscount(discountId) {
    return this.delete(`/discounts/${discountId}`);
  }

  // === WARRANTY MANAGEMENT ===
  
  /**
   * Get all warranties (read-only)
   */
  async getWarranties() {
    return this.get('/warranty');
  }

  // === UTILITY METHODS ===
  
  /**
   * Test API connection
   */
  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL}/health`, { method: 'GET' });
      return { success: response.ok, status: response.status };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if API is available
   */
  async isApiAvailable() {
    const result = await this.testConnection();
    return result.success;
  }
}

// Create singleton instance
export const apiService = new ApiService();
export default apiService;