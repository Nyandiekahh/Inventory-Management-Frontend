import React, { useState, useEffect } from 'react';
import { Save, X, Scan, Package } from 'lucide-react';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    barcode: '',
    price: '',
    costPrice: '',
    stock: '',
    minStock: '',
    supplier: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        barcode: product.barcode || '',
        price: product.price?.toString() || '',
        costPrice: product.costPrice?.toString() || '',
        stock: product.stock?.toString() || '',
        minStock: product.minStock?.toString() || '',
        supplier: product.supplier || ''
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.barcode.trim()) newErrors.barcode = 'Barcode is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid selling price is required';
    if (!formData.costPrice || parseFloat(formData.costPrice) <= 0) newErrors.costPrice = 'Valid cost price is required';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Valid stock quantity is required';
    if (!formData.minStock || parseInt(formData.minStock) < 0) newErrors.minStock = 'Valid minimum stock is required';
    if (!formData.supplier.trim()) newErrors.supplier = 'Supplier is required';

    if (parseFloat(formData.costPrice) > parseFloat(formData.price)) {
      newErrors.price = 'Selling price must be greater than cost price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const generateBarcode = () => {
    const barcode = Date.now().toString() + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    handleInputChange('barcode', barcode);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-full">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
        </div>
        
        <div className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              placeholder="Enter product name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <input
              type="text"
              placeholder="e.g., Beverages, Electronics"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.category ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>
          
          {/* Barcode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Barcode *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter or scan barcode"
                value={formData.barcode}
                onChange={(e) => handleInputChange('barcode', e.target.value)}
                className={`flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.barcode ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <button 
                type="button" 
                onClick={generateBarcode}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Generate barcode"
              >
                <Scan className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            {errors.barcode && <p className="text-red-500 text-xs mt-1">{errors.barcode}</p>}
          </div>
          
          {/* Pricing */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost Price (KSh) *
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.costPrice}
                onChange={(e) => handleInputChange('costPrice', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.costPrice ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.costPrice && <p className="text-red-500 text-xs mt-1">{errors.costPrice}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selling Price (KSh) *
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
          </div>
          
          {/* Stock Information */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Stock *
              </label>
              <input
                type="number"
                placeholder="0"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.stock ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Stock Level *
              </label>
              <input
                type="number"
                placeholder="0"
                value={formData.minStock}
                onChange={(e) => handleInputChange('minStock', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.minStock ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.minStock && <p className="text-red-500 text-xs mt-1">{errors.minStock}</p>}
            </div>
          </div>
          
          {/* Supplier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier *
            </label>
            <input
              type="text"
              placeholder="Enter supplier name"
              value={formData.supplier}
              onChange={(e) => handleInputChange('supplier', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.supplier ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.supplier && <p className="text-red-500 text-xs mt-1">{errors.supplier}</p>}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button 
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {product ? 'Update Product' : 'Add Product'}
            </button>
            <button 
              onClick={onCancel} 
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;