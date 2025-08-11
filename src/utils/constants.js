// Sample data for demonstration
export const sampleData = {
  superAdmin: {
    id: 1,
    name: "System Administrator",
    email: "admin@inventorysystem.com"
  },
  stores: [
    {
      id: 1,
      name: "Naivas Westlands",
      location: "Westlands, Nairobi",
      subscription: "Premium",
      expiryDate: "2025-12-31",
      status: "Active"
    },
    {
      id: 2, 
      name: "Tuskys Mombasa",
      location: "Mombasa, Kenya",
      subscription: "Standard", 
      expiryDate: "2025-10-15",
      status: "Active"
    }
  ],
  users: [
    {
      id: 1,
      name: "John Kamau",
      email: "john@naivas.com",
      role: "Admin",
      storeId: 1,
      permissions: ["all"]
    },
    {
      id: 2,
      name: "Mary Wanjiku", 
      email: "mary@naivas.com",
      role: "Cashier",
      storeId: 1,
      permissions: ["sales", "view_stock"]
    }
  ],
  products: [
    {
      id: 1,
      name: "Coca Cola 500ml",
      category: "Beverages",
      barcode: "12345678901",
      price: 80,
      costPrice: 60,
      stock: 120,
      minStock: 20,
      supplier: "Coca Cola Kenya",
      storeId: 1
    },
    {
      id: 2,
      name: "White Bread 400g",
      category: "Bakery",
      barcode: "23456789012", 
      price: 65,
      costPrice: 45,
      stock: 8,
      minStock: 15,
      supplier: "Superloaf",
      storeId: 1
    },
    {
      id: 3,
      name: "Rice 2kg",
      category: "Grains",
      barcode: "34567890123",
      price: 280,
      costPrice: 220,
      stock: 45,
      minStock: 10,
      supplier: "Mwea Rice",
      storeId: 1
    }
  ],
  sales: [
    {
      id: 1,
      date: "2025-08-11",
      time: "14:30",
      items: [
        { productId: 1, name: "Coca Cola 500ml", quantity: 2, price: 80 },
        { productId: 3, name: "Rice 2kg", quantity: 1, price: 280 }
      ],
      total: 440,
      cashier: "Mary Wanjiku",
      storeId: 1
    }
  ],
  purchaseOrders: [
    {
      id: 1,
      date: "2025-08-10",
      supplier: "Coca Cola Kenya",
      status: "Pending",
      items: [
        { productId: 1, name: "Coca Cola 500ml", quantity: 50, costPrice: 60 }
      ],
      total: 3000,
      storeId: 1
    }
  ]
};

export const USER_ROLES = {
  SUPER_ADMIN: 'superadmin',
  STORE_ADMIN: 'admin',
  STORE_USER: 'user'
};

export const PERMISSIONS = {
  ALL: 'all',
  SALES: 'sales',
  VIEW_STOCK: 'view_stock',
  MANAGE_PRODUCTS: 'manage_products',
  MANAGE_USERS: 'manage_users'
};

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3' },
  { id: 'products', label: 'Products', icon: 'Package' },
  { id: 'sales', label: 'Sales/POS', icon: 'ShoppingCart' },
  { id: 'purchase', label: 'Purchase Orders', icon: 'TrendingUp' },
  { id: 'reports', label: 'Reports', icon: 'BarChart3' },
  { id: 'users', label: 'Users', icon: 'Users' },
  { id: 'stores', label: 'Stores', icon: 'Store', superAdminOnly: true },
  { id: 'settings', label: 'Settings', icon: 'Settings' }
];