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

// Operations
const RouteManagement = lazy(() =>
  import("@/app/pages/operations/RouteManagement")
);
const DriverManagement = lazy(() =>
  import("@/app/pages/operations/DriverManagement")
);
const CustomerManagement = lazy(() =>
  import("@/app/pages/operations/CustomerManagement")
);

// Inventory
const Stock = lazy(() =>
  import("@/app/pages/operations/inventory/Stock")
);

// Billing
const OrderManagement = lazy(() =>
  import("@/app/pages/billing/OrderManagement")
);
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
  { path: "routes", name: "Routes", element: <RouteManagement /> },
  { path: "drivers", name: "Drivers", element: <DriverManagement /> },
  { path: "customers", name: "Customers", element: <CustomerManagement /> },

  // Inventory
  { path: "inventory/stock", name: "Stock", element: <Stock /> },

  // Billing & Finance
  { path: "orders", name: "Orders", element: <OrderManagement /> },
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
  { path: "routes", name: "Routes", element: <RouteManagement /> },
  { path: "drivers", name: "Drivers", element: <DriverManagement /> },
  { path: "customers", name: "Customers", element: <CustomerManagement /> },

  // Inventory
  { path: "inventory/stock", name: "Stock", element: <Stock /> },

  // Billing & Finance
  { path: "orders", name: "Orders", element: <OrderManagement /> },
  { path: "billings", name: "Billings", element: <BillingManagement /> },
];

import { Routes, Route, Navigate } from "react-router-dom";
import HomeLayout from "../layout/HomeLayout/HomeLayout";

export const AppRoutes = () => {
  return (
    <Routes>

      {/* Layout */}
      <Route path="/admin" element={<HomeLayout />}>

        {/* 🔥 MasterRoutes map */}
        {MasterRoutes.map((route, i) => (
          <Route
            key={i}
            path={route.path}
            element={route.element}
          />
        ))}

        {/* Default */}
        <Route index element={<Navigate to="dashboard" />} />
      </Route>

    </Routes>
  );
};