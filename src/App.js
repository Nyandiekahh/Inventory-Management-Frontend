import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import MainLayout from './components/MainLayout';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <div className="App">
            <MainLayout />
          </div>
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;