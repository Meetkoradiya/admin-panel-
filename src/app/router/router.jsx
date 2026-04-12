import { lazy } from "react";

// Public
const Login = lazy(() => import("../pages/auth/Login"));
const SignUp = lazy(() => import("../pages/auth/SignUp"));

// Dashboard / Home
const CRMAnalytics = lazy(() => import("@/app/pages/home"));

// Profile
const UserProfile = lazy(() =>
  import("@/app/pages/Profile/UserProfile/UserProfile")
);
const ChangePassword = lazy(() =>
  import("@/app/pages/Profile/ChangePassword/ChangePassword")
);

// Admin Operations & Entities
const RouteList = lazy(() => import("@/app/pages/admin/routes/routeList"));
const RouteCreate = lazy(() => import("@/app/pages/admin/routes/routeCreate"));

const DriverList = lazy(() => import("@/app/pages/admin/drivers/driverList"));
const DriverCreate = lazy(() => import("@/app/pages/admin/drivers/driverCreate"));

const CustomerList = lazy(() => import("@/app/pages/admin/customers/customerList"));
const CustomerCreate = lazy(() => import("@/app/pages/admin/customers/customerCreate"));
const CustomerDetail = lazy(() => import("@/app/pages/admin/customers/customerDetail"));

// Admin Inventory & Products
const InventoryList = lazy(() => import("@/app/pages/admin/inventory/inventoryList"));
const ProductList = lazy(() => import("@/app/pages/admin/product/product"));

// Admin Orders
const OrderList = lazy(() => import("@/app/pages/admin/orders/orderList"));

const BillingManagement = lazy(() =>
  import("../pages/billing/BillingManagement")
);

// ================= PUBLIC ROUTES =================
export const PublicRoutes = [
  { path: "login", name: "Login", element: <Login /> },
  { path: "signup", name: "Signup", element: <SignUp /> },
];

// ================= MASTER ROUTES =================
export const MasterRoutes = [
  { path: "dashboard", name: "Dashboard", element: <CRMAnalytics /> },
  { path: "profile", name: "Profile", element: <UserProfile /> },
  {
    path: "change-password",
    name: "Change Password",
    element: <ChangePassword />,
  },

  // Operations
  { path: "routes", name: "Routes", element: <RouteList /> },
  { path: "routes/add", name: "Add Route", element: <RouteCreate /> },
  { path: "routes/edit/:id", name: "Edit Route", element: <RouteCreate /> },
  { path: "drivers", name: "Drivers", element: <DriverList /> },
  { path: "drivers/add", name: "Add Driver", element: <DriverCreate /> },
  { path: "drivers/edit/:id", name: "Edit Driver", element: <DriverCreate /> },
  { path: "customers", name: "Customers", element: <CustomerList /> },
  { path: "customers/add", name: "Add Customer", element: <CustomerCreate /> },
  { path: "customers/edit/:id", name: "Edit Customer", element: <CustomerCreate /> },

  // Inventory
  { path: "inventory/stock", name: "Stock", element: <InventoryList /> },
  { path: "products", name: "Products", element: <ProductList /> },

  // Billing & Finance
  { path: "orders", name: "Orders", element: <OrderList /> },
  { path: "billings", name: "Billings", element: <BillingManagement /> },
];

// ================= ADMIN ROUTES =================
export const AdminRoutes = [
  { path: "dashboard", name: "Dashboard", element: <CRMAnalytics /> },
  { path: "profile", name: "Profile", element: <UserProfile /> },
  {
    path: "change-password",
    name: "Change Password",
    element: <ChangePassword />,
  },

  // Operations
  { path: "routes", name: "Routes", element: <RouteList /> },
  { path: "routes/add", name: "Add Route", element: <RouteCreate /> },
  { path: "routes/edit/:id", name: "Edit Route", element: <RouteCreate /> },
  { path: "drivers", name: "Drivers", element: <DriverList /> },
  { path: "drivers/add", name: "Add Driver", element: <DriverCreate /> },
  { path: "drivers/edit/:id", name: "Edit Driver", element: <DriverCreate /> },
  { path: "customers", name: "Customers", element: <CustomerList /> },
  { path: "customers/add", name: "Add Customer", element: <CustomerCreate /> },
  { path: "customers/edit/:id", name: "Edit Customer", element: <CustomerCreate /> },

  // Inventory
  { path: "inventory/stock", name: "Stock", element: <InventoryList /> },
  { path: "products", name: "Products", element: <ProductList /> },

  // Billing & Finance
  { path: "orders", name: "Orders", element: <OrderList /> },
  { path: "billings", name: "Billings", element: <BillingManagement /> },
];
