import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

import HomeLayout from "./app/layout/HomeLayout/HomeLayout";
import ChangePassword from "./app/pages/profile/ChangePassword/ChangePassword";
import UserProfile from "./app/pages/profile/UserProfile/UserProfile";
import ForgotPassword from "./app/pages/profile/ForgotPassword/ForgotPassword";
import VerifyOtp from "./app/pages/profile/ForgotPassword/VerifyOtp";
import ConfirmPassword from "./app/pages/profile/ForgotPassword/ConfirmPassword";
import AutoRefreshToken from "./app/pages/auth/AutoRefreshToken";
import PublicRoute from "./app/router/public";
import ProtectedRoute from "./app/router/protected";
import Login from "./app/pages/auth/Login";
import SignUp from "./app/pages/auth/SignUp";
import CRMAnalytics from "./app/pages/home";
import AppRoutes from "./app/router";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <>
      {isAuthenticated && <AutoRefreshToken />}

      <AppRoutes />
    </>
  );
}

export default App;
