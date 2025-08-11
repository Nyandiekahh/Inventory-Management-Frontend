// localStorage utility for data persistence
const STORAGE_KEYS = {
  PRODUCTS: 'inventory_products',
  SALES: 'inventory_sales',
  PURCHASE_ORDERS: 'inventory_purchase_orders',
  USERS: 'inventory_users',
  STORES: 'inventory_stores',
  CURRENT_USER: 'inventory_current_user',
  CURRENT_STORE: 'inventory_current_store',
  SETTINGS: 'inventory_settings'
};

class LocalStorageManager {
  // Generic methods
  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  clear() {
    try {
      // Only clear our app's data
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  // Specific data methods
  saveProducts(products) {
    return this.setItem(STORAGE_KEYS.PRODUCTS, products);
  }

  getProducts(defaultProducts = []) {
    return this.getItem(STORAGE_KEYS.PRODUCTS, defaultProducts);
  }

  saveSales(sales) {
    return this.setItem(STORAGE_KEYS.SALES, sales);
  }

  getSales(defaultSales = []) {
    return this.getItem(STORAGE_KEYS.SALES, defaultSales);
  }

  savePurchaseOrders(orders) {
    return this.setItem(STORAGE_KEYS.PURCHASE_ORDERS, orders);
  }

  getPurchaseOrders(defaultOrders = []) {
    return this.getItem(STORAGE_KEYS.PURCHASE_ORDERS, defaultOrders);
  }

  saveUsers(users) {
    return this.setItem(STORAGE_KEYS.USERS, users);
  }

  getUsers(defaultUsers = []) {
    return this.getItem(STORAGE_KEYS.USERS, defaultUsers);
  }

  saveStores(stores) {
    return this.setItem(STORAGE_KEYS.STORES, stores);
  }

  getStores(defaultStores = []) {
    return this.getItem(STORAGE_KEYS.STORES, defaultStores);
  }

  saveCurrentUser(user) {
    return this.setItem(STORAGE_KEYS.CURRENT_USER, user);
  }

  getCurrentUser() {
    return this.getItem(STORAGE_KEYS.CURRENT_USER);
  }

  saveCurrentStore(store) {
    return this.setItem(STORAGE_KEYS.CURRENT_STORE, store);
  }

  getCurrentStore() {
    return this.getItem(STORAGE_KEYS.CURRENT_STORE);
  }

  saveSettings(settings) {
    return this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  getSettings(defaultSettings = {}) {
    return this.getItem(STORAGE_KEYS.SETTINGS, defaultSettings);
  }

  // Utility methods
  isAvailable() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  getStorageInfo() {
    if (!this.isAvailable()) {
      return { available: false };
    }

    let totalSize = 0;
    let itemCount = 0;

    Object.values(STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += item.length;
        itemCount++;
      }
    });

    return {
      available: true,
      totalSize,
      itemCount,
      sizeMB: (totalSize / (1024 * 1024)).toFixed(2)
    };
  }

  // Backup and restore
  exportData() {
    const data = {};
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      const value = this.getItem(key);
      if (value) {
        data[name.toLowerCase()] = value;
      }
    });

    return {
      version: '1.0',
      timestamp: new Date().toISOString(),
      data
    };
  }

  importData(exportedData) {
    try {
      if (!exportedData.data) {
        throw new Error('Invalid data format');
      }

      Object.entries(exportedData.data).forEach(([name, value]) => {
        const key = STORAGE_KEYS[name.toUpperCase()];
        if (key) {
          this.setItem(key, value);
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error importing data:', error);
      return { success: false, error: error.message };
    }
  }

  // Reset to demo data
  resetToDemo(sampleData) {
    this.clear();
    this.saveProducts(sampleData.products);
    this.saveSales(sampleData.sales);
    this.savePurchaseOrders(sampleData.purchaseOrders);
    this.saveUsers(sampleData.users);
    this.saveStores(sampleData.stores);
    return true;
  }
}

// Create singleton instance
const storageManager = new LocalStorageManager();

export default storageManager;
export { STORAGE_KEYS };