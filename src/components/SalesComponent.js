import React, { useState } from 'react';
import { Scan, X, ShoppingCart, CreditCard } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const SalesComponent = ({ requireAdminAuth }) => {
  const { products, updateStock, addSale } = useStore();
  const { currentUser } = useAuth();
  const {
    cart,
    customerPayment,
    setCustomerPayment,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getChange,
    canCompleteTransation
  } = useCart();

  const [barcodeInput, setBarcodeInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const availableProducts = products.filter(p => p.stock > 0);
  const filteredProducts = availableProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.barcode.includes(searchTerm)
  );

  const handleBarcodeSubmit = () => {
    if (!barcodeInput.trim()) return;
    
    const product = products.find(p => p.barcode === barcodeInput);
    if (product && product.stock > 0) {
      addToCart(product);
      setBarcodeInput('');
    } else {
      alert('Product not found or out of stock');
    }
  };

  const handleRemoveFromCart = (productId) => {
    requireAdminAuth(() => {
      removeFromCart(productId);
    });
  };

  const completeSale = () => {
    if (!canCompleteTransation()) return;

    const total = getCartTotal();
    const saleData = {
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total,
      cashier: currentUser?.name || 'Unknown'
    };

    // Update stock levels
    const stockUpdates = cart.map(item => ({
      id: item.id,
      quantity: item.quantity
    }));

    updateStock(stockUpdates);
    addSale(saleData);
    clearCart();
    
    alert(`Sale completed successfully! Change: KSh ${getChange().toFixed(2)}`);
  };

  const CartItem = ({ item }) => (
    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <p className="font-medium text-sm">{item.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-600">KSh {item.price}</span>
          <span className="text-xs text-gray-400">×</span>
          <input
            type="number"
            min="1"
            max={item.stock}
            value={item.quantity}
            onChange={(e) => {
              const newQty = parseInt(e.target.value) || 1;
              updateQuantity(item.id, newQty);
            }}
            className="w-16 px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold text-sm">KSh {(item.price * item.quantity).toFixed(2)}</span>
        <button 
          onClick={() => handleRemoveFromCart(item.id)}
          className="text-red-500 hover:text-red-700 p-1"
          title="Remove item (requires admin)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const ProductCard = ({ product }) => (
    <div 
      onClick={() => addToCart(product)}
      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <h4 className="font-medium text-sm mb-1">{product.name}</h4>
      <p className="text-xs text-gray-600 mb-2">{product.category}</p>
      <div className="flex justify-between items-center">
        <span className="font-bold text-blue-600">KSh {product.price}</span>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          Stock: {product.stock}
        </span>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold">Product Selection</h3>
            </div>
            
            {/* Barcode Scanner */}
            <div className="mb-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Scan className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Scan or enter barcode..."
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleBarcodeSubmit();
                      }
                    }}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button 
                  onClick={handleBarcodeSubmit}
                  className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  {searchTerm ? 'No products match your search' : 'No products available'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Shopping Cart & Checkout */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold">Checkout</h3>
            {cart.length > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
            )}
          </div>
          
          {/* Cart Items */}
          <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
            {cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
            {cart.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Cart is empty</p>
                <p className="text-xs">Add products to start a sale</p>
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <>
              {/* Totals */}
              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between items-center text-lg font-bold mb-4">
                  <span>Total:</span>
                  <span>KSh {getCartTotal().toFixed(2)}</span>
                </div>

                {/* Payment Input */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Payment
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={customerPayment}
                      onChange={(e) => setCustomerPayment(e.target.value)}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  {/* Change Calculation */}
                  {customerPayment && (
                    <div className={`flex justify-between items-center p-3 rounded-lg ${
                      getChange() >= 0 ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                      <span className="font-medium">
                        {getChange() >= 0 ? 'Change:' : 'Insufficient payment:'}
                      </span>
                      <span className="font-bold">
                        KSh {Math.abs(getChange()).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={completeSale}
                      disabled={!canCompleteTransation()}
                      className={`w-full py-3 rounded-lg font-medium transition-colors ${
                        canCompleteTransation()
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Complete Sale
                    </button>
                    
                    <button
                      onClick={clearCart}
                      className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesComponent;