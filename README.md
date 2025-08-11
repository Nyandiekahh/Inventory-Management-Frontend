# **InventoryPro Frontend - Technical Documentation**

## **📋 Table of Contents**
1. [System Overview](#system-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Data Models](#data-models)
5. [API Requirements](#api-requirements)
6. [Authentication Flow](#authentication-flow)
7. [Business Logic](#business-logic)
8. [State Management](#state-management)
9. [Real-time Requirements](#real-time-requirements)
10. [Integration Points](#integration-points)
11. [Frontend Component Structure](#frontend-component-structure)

---

## **🎯 System Overview**

InventoryPro is a **multi-tenant SaaS inventory management system** designed for retail stores, supermarkets, and multi-location businesses. The system supports three distinct user roles with different access levels and interfaces.

### **Core Features**
- Multi-tenant store management
- Real-time inventory tracking
- Point of Sale (POS) system
- Purchase order management
- Role-based access control
- Analytics and reporting
- Barcode scanning support
- Receipt generation

---

## **🏗️ Architecture & Technology Stack**

### **Frontend Stack**
- **Framework**: React 18 with functional components and hooks
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **Data Persistence**: localStorage (temporary) → will integrate with backend APIs
- **Build Tool**: Create React App

### **Architecture Pattern**
- **Component-based architecture** with separation of concerns
- **Context providers** for global state management
- **Custom hooks** for business logic
- **Service layer** for API communication (prepared for backend integration)

---

## **👥 User Roles & Permissions**

### **1. Super Administrator**
**Database Role**: `superadmin`
**Scope**: System-wide access across all stores

**Permissions**:
- Manage all stores and their subscriptions
- View global analytics across all stores
- Manage system-wide users
- Configure global system settings
- Monitor subscription payments and renewals
- Access all stores' data

**Navigation Access**:
- System Overview Dashboard
- Store Management
- Global Analytics
- Subscription Management
- System Users
- System Settings

### **2. Store Administrator**
**Database Role**: `admin`
**Scope**: Single store management

**Permissions**:
- Full CRUD access to store's products
- Manage store's staff/users
- Access store's sales and analytics
- Manage purchase orders
- Configure store settings
- Override cashier actions (with password)

**Navigation Access**:
- Store Dashboard
- Products Management
- Sales/POS System
- Purchase Orders
- Inventory Management
- Reports & Analytics
- Staff Management
- Store Settings

### **3. Store User/Cashier**
**Database Role**: `user` or `cashier`
**Scope**: Limited store operations

**Permissions**:
- Process sales transactions
- View product information (read-only)
- View personal sales history
- Access basic store information
- Requires admin authorization for sensitive actions

**Navigation Access**:
- Personal Dashboard
- Point of Sale
- View Products (read-only)
- Personal Sales History
- Profile Settings

---

## **📊 Data Models**

### **Store Model**
```javascript
Store {
  id: number,
  name: string,
  location: string,
  address: {
    street: string,
    city: string,
    state: string,
    country: string,
    postal_code: string
  },
  contact: {
    phone: string,
    email: string,
    website?: string
  },
  subscription: {
    plan: 'Basic' | 'Standard' | 'Premium',
    start_date: date,
    expiry_date: date,
    status: 'Active' | 'Suspended' | 'Cancelled',
    auto_renew: boolean
  },
  settings: {
    currency: string,
    tax_rate: number,
    business_hours: object,
    receipt_template: object
  },
  created_at: timestamp,
  updated_at: timestamp
}
```

### **User Model**
```javascript
User {
  id: number,
  name: string,
  email: string,
  password_hash: string,
  role: 'superadmin' | 'admin' | 'cashier',
  store_id: number | null, // null for super admin
  permissions: string[], // ['all'] | ['sales', 'view_stock', 'manage_products']
  profile: {
    phone?: string,
    employee_id?: string,
    hire_date?: date
  },
  is_active: boolean,
  last_login: timestamp,
  created_at: timestamp,
  updated_at: timestamp
}
```

### **Product Model**
```javascript
Product {
  id: number,
  name: string,
  description?: string,
  category: string,
  barcode: string, // unique within store
  sku?: string,
  pricing: {
    cost_price: decimal,
    selling_price: decimal,
    tax_rate?: decimal
  },
  inventory: {
    current_stock: number,
    min_stock_level: number,
    max_stock_level?: number,
    unit: string // 'pieces', 'kg', 'liters', etc.
  },
  supplier: {
    name: string,
    contact?: string
  },
  store_id: number,
  is_active: boolean,
  created_at: timestamp,
  updated_at: timestamp
}
```

### **Sale Model**
```javascript
Sale {
  id: number,
  sale_number: string, // formatted: "SALE-2025-001"
  store_id: number,
  cashier_id: number,
  items: SaleItem[],
  totals: {
    subtotal: decimal,
    tax_amount: decimal,
    discount_amount: decimal,
    total_amount: decimal
  },
  payment: {
    amount_received: decimal,
    change_given: decimal,
    payment_method: 'Cash' | 'Card' | 'Mobile Money'
  },
  customer?: {
    name?: string,
    phone?: string,
    email?: string
  },
  status: 'Completed' | 'Refunded' | 'Cancelled',
  created_at: timestamp
}

SaleItem {
  product_id: number,
  product_name: string,
  quantity: number,
  unit_price: decimal,
  total_price: decimal,
  discount?: decimal
}
```

### **Purchase Order Model**
```javascript
PurchaseOrder {
  id: number,
  po_number: string, // formatted: "PO-2025-001"
  store_id: number,
  supplier: {
    name: string,
    contact: string,
    address?: string
  },
  items: POItem[],
  totals: {
    subtotal: decimal,
    tax_amount: decimal,
    total_amount: decimal
  },
  status: 'Draft' | 'Pending' | 'Received' | 'Cancelled',
  order_date: date,
  expected_date?: date,
  received_date?: date,
  created_by: number, // user_id
  received_by?: number, // user_id
  notes?: string,
  created_at: timestamp,
  updated_at: timestamp
}

POItem {
  product_id: number,
  product_name: string,
  quantity_ordered: number,
  quantity_received?: number,
  unit_cost: decimal,
  total_cost: decimal
}
```

---

## **🔌 API Requirements**

### **Authentication APIs**
```javascript
POST /api/auth/login
Request: { email, password, role? }
Response: { user, token, store?, permissions }

POST /api/auth/logout
Request: { token }
Response: { success }

GET /api/auth/me
Headers: { Authorization: Bearer <token> }
Response: { user, store?, permissions }

POST /api/auth/refresh
Request: { refresh_token }
Response: { token, refresh_token }
```

### **Store Management APIs**
```javascript
// Super Admin only
GET /api/stores
Response: Store[]

POST /api/stores
Request: Store
Response: Store

PUT /api/stores/:id
Request: Partial<Store>
Response: Store

DELETE /api/stores/:id
Response: { success }

// Current store info
GET /api/store/current
Response: Store
```

### **User Management APIs**
```javascript
GET /api/users
Query: { store_id?, role? }
Response: User[]

POST /api/users
Request: User
Response: User

PUT /api/users/:id
Request: Partial<User>
Response: User

DELETE /api/users/:id
Response: { success }

POST /api/users/:id/reset-password
Response: { success }
```

### **Product Management APIs**
```javascript
GET /api/products
Query: { store_id?, category?, search?, barcode? }
Response: Product[]

POST /api/products
Request: Product
Response: Product

PUT /api/products/:id
Request: Partial<Product>
Response: Product

DELETE /api/products/:id
Response: { success }

GET /api/products/low-stock
Query: { store_id? }
Response: Product[]

POST /api/products/bulk-update
Request: { products: Partial<Product>[] }
Response: { success, updated_count }
```

### **Sales APIs**
```javascript
GET /api/sales
Query: { 
  store_id?, 
  cashier_id?, 
  start_date?, 
  end_date?,
  page?, 
  limit? 
}
Response: { sales: Sale[], pagination }

POST /api/sales
Request: Sale
Response: Sale

GET /api/sales/:id
Response: Sale

PUT /api/sales/:id/refund
Request: { reason, refund_amount? }
Response: Sale

GET /api/sales/analytics
Query: { store_id?, period?, start_date?, end_date? }
Response: {
  total_sales: decimal,
  total_transactions: number,
  average_transaction: decimal,
  top_products: Product[],
  sales_by_day: object[]
}
```

### **Purchase Order APIs**
```javascript
GET /api/purchase-orders
Query: { store_id?, status?, supplier? }
Response: PurchaseOrder[]

POST /api/purchase-orders
Request: PurchaseOrder
Response: PurchaseOrder

PUT /api/purchase-orders/:id
Request: Partial<PurchaseOrder>
Response: PurchaseOrder

POST /api/purchase-orders/:id/receive
Request: { items: { product_id, quantity_received }[] }
Response: PurchaseOrder

DELETE /api/purchase-orders/:id
Response: { success }
```

### **Analytics APIs**
```javascript
GET /api/analytics/dashboard
Query: { store_id?, period? }
Response: {
  sales_summary: object,
  inventory_summary: object,
  top_products: Product[],
  low_stock_items: Product[],
  recent_sales: Sale[]
}

GET /api/analytics/reports
Query: { 
  type: 'sales' | 'inventory' | 'products',
  format: 'json' | 'csv' | 'excel',
  store_id?,
  start_date?,
  end_date?
}
Response: File | JSON

// Super Admin only
GET /api/analytics/global
Response: {
  total_stores: number,
  total_revenue: decimal,
  active_subscriptions: number,
  system_metrics: object
}
```

---

## **🔐 Authentication Flow**

### **Login Process**
1. User enters credentials on login form
2. Frontend sends `POST /api/auth/login` with email, password, role
3. Backend validates credentials and returns JWT token + user data
4. Frontend stores token in secure storage (httpOnly cookie preferred)
5. Frontend redirects to appropriate dashboard based on user role
6. All subsequent API calls include token in Authorization header

### **Role-Based Routing**
```javascript
// Frontend routing logic
if (user.role === 'superadmin') {
  redirect('/admin/dashboard')
} else if (user.role === 'admin') {
  redirect('/store/dashboard')
} else {
  redirect('/pos/dashboard')
}
```

### **Token Management**
- JWT tokens with 24-hour expiry
- Refresh token mechanism for seamless user experience
- Automatic token refresh before expiry
- Secure logout that invalidates tokens

---

## **🏪 Business Logic**

### **Multi-Tenant Data Isolation**
- All store-specific data must be filtered by `store_id`
- Super admins can access any store's data
- Store admins and users can only access their assigned store
- API endpoints must enforce tenant isolation at database level

### **Inventory Management**
```javascript
// Stock update logic when sale is completed
function processSale(saleData) {
  1. Validate all products have sufficient stock
  2. Create sale record
  3. Update product stock levels atomically
  4. Generate sale receipt
  5. Update analytics counters
  6. Send low-stock alerts if needed
}

// Purchase order receiving
function receivePurchaseOrder(poId, receivedItems) {
  1. Validate PO exists and is in 'Pending' status
  2. Update PO items with received quantities
  3. Update product stock levels
  4. Mark PO as 'Received' if all items received
  5. Create stock movement records
}
```

### **Permission Checking**
```javascript
// Middleware for API endpoints
function checkPermission(requiredPermission) {
  if (user.role === 'superadmin') return true
  if (user.role === 'admin') return true
  return user.permissions.includes(requiredPermission)
}

// Store access validation
function validateStoreAccess(requestedStoreId) {
  if (user.role === 'superadmin') return true
  return user.store_id === requestedStoreId
}
```

### **Admin Authorization Override**
- Sensitive actions (delete sale items, refunds) require admin password
- Frontend shows password prompt for non-admin users
- Backend validates admin credentials before allowing action
- Actions are logged with admin user who authorized

---

## **⚡ State Management**

### **Context Structure**
```javascript
// AuthContext
{
  isLoggedIn: boolean,
  currentUser: User | null,
  token: string | null,
  login: (credentials) => Promise<boolean>,
  logout: () => void,
  refreshToken: () => Promise<boolean>
}

// StoreContext  
{
  currentStore: Store | null,
  products: Product[],
  salesHistory: Sale[],
  purchaseOrders: PurchaseOrder[],
  lowStockItems: Product[],
  // CRUD operations
  addProduct: (product) => Promise<Product>,
  updateProduct: (id, data) => Promise<Product>,
  deleteProduct: (id) => Promise<boolean>,
  // etc.
}

// CartContext (for POS)
{
  cart: CartItem[],
  customerPayment: number,
  addToCart: (product, quantity) => void,
  removeFromCart: (productId) => void,
  clearCart: () => void,
  completeSale: () => Promise<Sale>
}
```

### **Data Synchronization**
- Context providers fetch fresh data on mount
- Optimistic updates for better UX
- Error handling with rollback mechanisms
- Real-time updates via WebSocket (optional)

---

## **🔄 Real-time Requirements**

### **Stock Level Updates**
- Real-time stock updates when sales are completed
- Low stock alerts pushed to admin users
- Inventory level synchronization across POS terminals

### **Sale Notifications**
- Real-time sale completion notifications
- Daily/shift summary updates
- Performance metrics updates

### **WebSocket Events** (Optional Enhancement)
```javascript
// Client subscribes to store-specific events
socket.join(`store_${storeId}`)

// Events to handle
- 'stock_update': { productId, newStock }
- 'new_sale': { saleId, amount, cashier }
- 'low_stock_alert': { productId, currentStock }
- 'user_login': { userId, timestamp }
```

---

## **🔗 Integration Points**

### **Barcode Scanner Integration**
```javascript
// USB HID barcode scanner integration
- Scanners act as keyboard input devices
- Barcode input triggers product lookup
- Support for Code 128, EAN-13, UPC formats
- Fallback manual barcode entry

// Implementation
function handleBarcodeInput(barcode) {
  1. Validate barcode format
  2. Search product by barcode
  3. Add to cart if found and in stock
  4. Show error if not found
}
```

### **Receipt Printing**
```javascript
// Browser printing API
window.print() // for receipt modal

// ESC/POS thermal printer integration (future)
- USB/Bluetooth thermal printer support
- Custom receipt templates
- Logo and formatting support
```

### **Export Functionality**
```javascript
// CSV/Excel export for reports
GET /api/analytics/reports?format=csv
- Sales reports by date range
- Inventory reports
- User activity reports
- Financial summaries
```

### **Payment Integration** (Future Enhancement)
```javascript
// Mobile money integration (M-Pesa, etc.)
- Payment processing APIs
- Transaction verification
- Receipt integration
- Refund handling
```

---

## **🏗️ Frontend Component Structure**

### **App Architecture**
```
src/
├── components/
│   ├── common/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── dashboard/       # Dashboard components
│   ├── pos/            # Point of sale components
│   ├── inventory/      # Product management
│   ├── reports/        # Analytics and reports
│   └── admin/          # Admin-only components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── utils/              # Helper functions
└── constants/          # App constants
```

### **Service Layer Structure**
```javascript
// services/api.js - Base API configuration
class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_BASE_URL
    this.token = localStorage.getItem('token')
  }
  
  async request(endpoint, options = {}) {
    // Add auth headers, handle errors, etc.
  }
}

// services/authService.js
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  getCurrentUser: () => api.get('/auth/me')
}

// services/productService.js
export const productService = {
  getProducts: (storeId, filters) => api.get('/products', { params: { store_id: storeId, ...filters } }),
  createProduct: (product) => api.post('/products', product),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`)
}
```

---

## **📋 Backend Development Checklist**

### **Database Setup**
- [ ] Create multi-tenant database schema
- [ ] Implement row-level security for tenant isolation
- [ ] Set up proper indexes for performance
- [ ] Create database migrations
- [ ] Set up backup and recovery procedures

### **Authentication & Authorization**
- [ ] Implement JWT token system
- [ ] Create role-based permission middleware
- [ ] Set up password hashing (bcrypt)
- [ ] Implement rate limiting for auth endpoints
- [ ] Add session management

### **API Development**
- [ ] Create RESTful API endpoints for all models
- [ ] Implement request validation (Joi/Yup)
- [ ] Add pagination for list endpoints
- [ ] Implement search and filtering
- [ ] Add comprehensive error handling

### **Business Logic**
- [ ] Implement atomic stock updates
- [ ] Create low stock alert system
- [ ] Add audit logging for sensitive actions
- [ ] Implement data validation rules
- [ ] Create automated backup systems

### **Testing**
- [ ] Unit tests for all business logic
- [ ] Integration tests for API endpoints
- [ ] Load testing for multi-tenant scenarios
- [ ] Security testing for authorization
- [ ] End-to-end testing with frontend

### **Deployment**
- [ ] Set up production environment
- [ ] Configure SSL certificates
- [ ] Implement monitoring and logging
- [ ] Set up automated deployments
- [ ] Create disaster recovery plan

---

## **🎯 Success Metrics**

### **Performance Requirements**
- API response time < 200ms for 95% of requests
- Support 100+ concurrent users per store
- 99.9% uptime SLA
- Sub-second search response times

### **Security Requirements**
- JWT token expiry and refresh
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Rate limiting on authentication

### **Scalability Requirements**
- Support 1000+ stores
- Handle 10,000+ daily transactions per store
- Horizontal scaling capability
- Database sharding for large datasets