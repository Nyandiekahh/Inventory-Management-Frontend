import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [customerPayment, setCustomerPayment] = useState('');

  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? {...item, quantity: item.quantity + quantity}
          : item
      ));
    } else {
      setCart([...cart, {...product, quantity}]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? {...item, quantity: newQuantity}
          : item
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
    setCustomerPayment('');
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const getChange = () => {
    const total = getCartTotal();
    const payment = parseFloat(customerPayment) || 0;
    return payment - total;
  };

  const canCompleteTransation = () => {
    return cart.length > 0 && customerPayment && getChange() >= 0;
  };

  const value = {
    cart,
    customerPayment,
    setCustomerPayment,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    getChange,
    canCompleteTransation
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};