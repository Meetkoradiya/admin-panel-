import { lazy } from "react";

// Public Routes
const Login = lazy(() => import("../pages/auth/Login"));
const SignUp = lazy(() => import("../pages/auth/SignUp"));

export const PublicRoutes = [
  { path: "login", name: "Login", element: <Login /> },
  { path: "signup", name: "Signup", element: <SignUp /> },
];

// Master Routes
const CRMAnalytics = lazy(() => import("@/app/pages/home"));
const UserProfile = lazy(
  () => import("@/app/pages/Profile/UserProfile/UserProfile"),
);
const ChangePassword = lazy(
  () => import("@/app/pages/Profile/ChangePassword/ChangePassword"),
);

export const MasterRoutes = [
  { path: "dashboard", name: "Dashboard", element: <CRMAnalytics /> },
  { path: "profile", name: "UserProfile", element: <UserProfile /> },
  {
    path: "change-password",
    name: "ChangePassword",
    element: <ChangePassword />,
  },
];

// Admin routes
const ManagerDashboard = lazy(() => import("@/app/pages/home"));

export const AdminRoutes = [
  { path: "dashboard", name: "Dashboard", element: <ManagerDashboard /> },

  { path: "profile", name: "UserProfile", element: <UserProfile /> },
  {
    path: "change-password",
    name: "ChangePassword",
    element: <ChangePassword />,
  },
];
