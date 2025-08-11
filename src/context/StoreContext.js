import React, { createContext, useContext, useState, useEffect } from 'react';
import { sampleData } from '../utils/constants';
import { useAuth } from './AuthContext';
import storageManager from '../utils/localStorage';

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider = ({ children }) => {
  const { currentUser, isSuperAdmin } = useAuth();
  const [currentStore, setCurrentStore] = useState(null);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  // Initialize data from localStorage or use sample data
  useEffect(() => {
    const savedStores = storageManager.getStores();
    const savedProducts = storageManager.getProducts();
    const savedSales = storageManager.getSales();
    const savedPurchaseOrders = storageManager.getPurchaseOrders();
    const savedCurrentStore = storageManager.getCurrentStore();

    // If no saved data exists, use sample data
    if (savedStores.length === 0) {
      setStores(sampleData.stores);
      setProducts(sampleData.products);
      setSalesHistory(sampleData.sales);
      setPurchaseOrders(sampleData.purchaseOrders);
      
      // Save sample data to localStorage
      storageManager.saveStores(sampleData.stores);
      storageManager.saveProducts(sampleData.products);
      storageManager.saveSales(sampleData.sales);
      storageManager.savePurchaseOrders(sampleData.purchaseOrders);
    } else {
      setStores(savedStores);
      setProducts(savedProducts);
      setSalesHistory(savedSales);
      setPurchaseOrders(savedPurchaseOrders);
      
      if (savedCurrentStore) {
        setCurrentStore(savedCurrentStore);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (stores.length > 0) {
      storageManager.saveStores(stores);
    }
  }, [stores]);

  useEffect(() => {
    if (products.length > 0) {
      storageManager.saveProducts(products);
    }
  }, [products]);

  useEffect(() => {
    if (salesHistory.length > 0) {
      storageManager.saveSales(salesHistory);
    }
  }, [salesHistory]);

  useEffect(() => {
    if (purchaseOrders.length > 0) {
      storageManager.savePurchaseOrders(purchaseOrders);
    }
  }, [purchaseOrders]);

  useEffect(() => {
    if (currentStore) {
      storageManager.saveCurrentStore(currentStore);
    }
  }, [currentStore]);

  // Set default store when user logs in
  useEffect(() => {
    if (currentUser && !isSuperAdmin() && !currentStore) {
      // For regular users, set their assigned store
      const userStore = stores.find(store => store.id === currentUser.storeId);
      if (userStore) {
        setCurrentStore(userStore);
      }
    }
  }, [currentUser, stores, isSuperAdmin, currentStore]);

  const addProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: Date.now(),
      storeId: currentStore?.id || 1,
      price: parseFloat(productData.price),
      costPrice: parseFloat(productData.costPrice),
      stock: parseInt(productData.stock),
      minStock: parseInt(productData.minStock)
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (productId, productData) => {
    setProducts(prev => prev.map(p => 
      p.id === productId 
        ? {
            ...productData,
            id: productId,
            storeId: p.storeId,
            price: parseFloat(productData.price),
            costPrice: parseFloat(productData.costPrice),
            stock: parseInt(productData.stock),
            minStock: parseInt(productData.minStock)
          }
        : p
    ));
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const updateStock = (productUpdates) => {
    setProducts(prev => prev.map(product => {
      const update = productUpdates.find(u => u.id === product.id);
      return update ? { ...product, stock: product.stock - update.quantity } : product;
    }));
  };

  const addSale = (saleData) => {
    const newSale = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-GB', { hour12: false }).slice(0, 5),
      ...saleData,
      storeId: currentStore?.id || 1
    };
    setSalesHistory(prev => [newSale, ...prev]);
    return newSale; // Return the new sale so we can use it for receipt
  };

  const updatePurchaseOrder = (poId, updates) => {
    setPurchaseOrders(prev => prev.map(po => 
      po.id === poId ? { ...po, ...updates } : po
    ));
  };

  const getLowStockItems = () => {
    return products.filter(p => p.stock <= p.minStock);
  };

  const getTotalInventoryValue = () => {
    return products.reduce((sum, p) => sum + (p.stock * p.costPrice), 0);
  };

  const getTodaySales = () => {
    const today = new Date().toISOString().split('T')[0];
    return salesHistory
      .filter(s => s.date === today)
      .reduce((sum, s) => sum + s.total, 0);
  };

  const value = {
    currentStore,
    setCurrentStore,
    stores,
    products,
    salesHistory,
    purchaseOrders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    addSale,
    updatePurchaseOrder,
    getLowStockItems,
    getTotalInventoryValue,
    getTodaySales
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};