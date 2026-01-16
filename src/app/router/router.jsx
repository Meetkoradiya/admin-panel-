import { lazy } from "react";

// Public
const Login = lazy(() => import("../pages/auth/Login"));
const SignUp = lazy(() => import("../pages/auth/SignUp"));

// Master
const CRMAnalytics = lazy(() => import("@/app/pages/home"));
const UserProfile = lazy(() => import("@/app/pages/Profile/UserProfile/UserProfile"));
const ChangePassword = lazy(() => import("@/app/pages/Profile/ChangePassword/ChangePassword"));
const RouteManagement = lazy(() => import("@/app/pages/operations/RouteManagement"));
const Stock = lazy(() => import("@/app/pages/operations/inventory/Stock")); // stock 

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

  //  Inventory
  { path: "inventory/stock", name: "Stock", element: <Stock /> },
];

export const AdminRoutes = [
  { path: "dashboard", name: "Dashboard", element: <CRMAnalytics /> },
];
