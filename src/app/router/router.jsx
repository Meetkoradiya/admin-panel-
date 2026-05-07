import { lazy } from "react";

// Public
const Login = lazy(() => import("../pages/auth/Login"));
const SignUp = lazy(() => import("../pages/auth/SignUp"));

// Dashboard / Home
const CRMAnalytics = lazy(() => import("@/app/pages/home"));
const MasterDashboard = lazy(() => import("@/app/pages/master/MasterDashboard"));

// Profile & Settings
const Settings = lazy(() =>
  import("@/app/pages/profile/Settings/Settings")
);

// Master Admin Management System
const AdminList = lazy(() => import("@/app/pages/master/admins/adminList"));
const AdminCreate = lazy(() => import("@/app/pages/master/admins/adminCreate"));
const OutletList = lazy(() => import("@/app/pages/master/outlets/outletList"));
const OutletCreate = lazy(() => import("@/app/pages/master/outlets/outletCreate"));
const SubscriptionList = lazy(() => import("@/app/pages/master/subscriptions/subscriptionList"));
const DeviceList = lazy(() => import("@/app/pages/master/devices/deviceList"));


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
const DeviceVerificationList = lazy(() => import("@/app/pages/admin/device-verification/deviceVerificationList"));
const ComplaintList = lazy(() => import("@/app/pages/admin/complaints/complaintList"));
const ValidationList = lazy(() => import("@/app/pages/admin/validations/validationList"));
const ValidationCreate = lazy(() => import("@/app/pages/admin/validations/validationCreate"));

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
  { path: "dashboard", name: "Dashboard", element: <MasterDashboard /> },
  { path: "settings", name: "Settings", element: <Settings /> },
  { path: "profile", name: "Profile", element: <Settings /> },
  {
    path: "change-password",
    name: "Change Password",
    element: <Settings />,
  },

  // Management System
  { path: "admins", name: "Admin Management", element: <AdminList /> },
  { path: "admins/add", name: "Add Admin", element: <AdminCreate /> },
  { path: "admins/edit/:id", name: "Edit Admin", element: <AdminCreate /> },
  { path: "outlets", name: "Outlet Management", element: <OutletList /> },
  { path: "outlets/add", name: "Add Outlet", element: <OutletCreate /> },
  { path: "outlets/edit/:id", name: "Edit Outlet", element: <OutletCreate /> },
  { path: "subscriptions", name: "Subscriptions", element: <SubscriptionList /> },
  { path: "devices", name: "Device Verification", element: <DeviceList /> },


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
  { path: "customers/view/:id", name: "Customer Details", element: <CustomerDetail /> },

  // Inventory
  { path: "inventory/stock", name: "Stock", element: <InventoryList /> },
  { path: "products", name: "Products", element: <ProductList /> },

  // Billing & Finance
  { path: "orders", name: "Orders", element: <OrderList /> },
  { path: "billings", name: "Billings", element: <BillingManagement /> },
];

export const AdminRoutes = [
  { path: "dashboard", name: "Dashboard", element: <CRMAnalytics /> },
  { path: "settings", name: "Settings", element: <Settings /> },
  { path: "profile", name: "Profile", element: <Settings /> },
  {
    path: "change-password",
    name: "Change Password",
    element: <Settings />,
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
  { path: "customers/view/:id", name: "Customer Details", element: <CustomerDetail /> },

  // Inventory
  { path: "inventory/stock", name: "Stock", element: <InventoryList /> },
  { path: "products", name: "Products", element: <ProductList /> },


  // Billing & Finance
  { path: "orders", name: "Orders", element: <OrderList /> },
  { path: "billings", name: "Billings", element: <BillingManagement /> },

  // Verification & Support
  { path: "devices", name: "Device Verification", element: <DeviceVerificationList /> },
  { path: "complaints", name: "Complaints", element: <ComplaintList /> },
  { path: "validations", name: "Validations", element: <ValidationList /> },
  { path: "validations/add", name: "Add Validation", element: <ValidationCreate /> },
  { path: "validations/edit/:id", name: "Edit Validation", element: <ValidationCreate /> },
];
