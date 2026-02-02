import { lazy } from "react";

// Public
const Login = lazy(() => import("../pages/auth/Login"));
const SignUp = lazy(() => import("../pages/auth/SignUp"));

// Master
const CRMAnalytics = lazy(() => import("@/app/pages/home"));
const UserProfile = lazy(() => import("@/app/pages/Profile/UserProfile/UserProfile"));
const ChangePassword = lazy(() => import("@/app/pages/Profile/ChangePassword/ChangePassword"));
const RouteManagement = lazy(() => import("@/app/pages/operations/RouteManagement"));
const DriverManagement = lazy(() => import("@/app/pages/operations/DriverManagement"));
const Stock = lazy(() => import("@/app/pages/operations/inventory/Stock"));
const BillingManagement = lazy(() => import("../pages/billing/BillingManagement")); 

// New Management Pages
const CustomerManagement = lazy(() => import("@/app/pages/operations/CustomerManagement"));
const OrderManagement = lazy(() => import("@/app/pages/billing/OrderManagement"));

export const PublicRoutes = [
  { path: "login", name: "Login", element: <Login /> },
  { path: "signup", name: "Signup", element: <SignUp /> },
];

export const MasterRoutes = [
  { path: "dashboard", name: "Dashboard", element: <CRMAnalytics /> },
  { path: "profile", name: "Profile", element: <UserProfile /> },
  { path: "change-password", name: "ChangePassword", element: <ChangePassword /> },

  // Operations
  { path: "routes", name: "Routes", element: <RouteManagement /> },
  { path: "drivers", name: "Drivers", element: <DriverManagement /> }, 
  { path: "customers", name: "Customers", element: <CustomerManagement /> }, // New Route

  // Inventory
  { path: "inventory/stock", name: "Stock", element: <Stock /> },

  // Billing & Finance
  { path: "orders", name: "Orders", element: <OrderManagement /> }, // New Route
  { path: "billings", name: "Billings", element: <BillingManagement /> },
];

export const AdminRoutes = [
  { path: "dashboard", name: "Dashboard", element: <CRMAnalytics /> },
];