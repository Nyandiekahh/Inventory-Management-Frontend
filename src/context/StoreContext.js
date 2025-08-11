import React, { createContext, useContext, useState, useEffect } from 'react';
import { sampleData } from '../utils/constants';
import { useAuth } from './AuthContext';

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
  const [stores] = useState(sampleData.stores);
  const [products, setProducts] = useState(sampleData.products);
  const [salesHistory, setSalesHistory] = useState(sampleData.sales);
  const [purchaseOrders, setPurchaseOrders] = useState(sampleData.purchaseOrders);

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