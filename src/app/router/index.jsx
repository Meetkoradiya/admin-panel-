import React, { useRef } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoute from "./public";
import ProtectedRoute from "./protected";
import { AdminRoutes, MasterRoutes, PublicRoutes } from "./router";
import HomeLayout from "../layout/HomeLayout/HomeLayout";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOtp from "../pages/auth/VerifyOtp";
import CreateNewPassword from "../pages/auth/CreateNewPassword"; 

const AppRoutes = () => {
  const toastRef = useRef(null);
  return (
    <>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route index element={<Navigate to="/login" replace />} />
          {PublicRoutes.map((route) => (
            <Route key={route.name} path={route.path} element={route.element} />
          ))}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          
          {/* 2. Added Create New Password Route */}
          <Route path="/create-new-password" element={<CreateNewPassword />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["MASTER_ADMIN"]} />}>
          <Route path="/master" element={<HomeLayout toastRef={toastRef} />}>
            <Route index element={<Navigate to="/master/dashboard" replace />} />
            {MasterRoutes.map((route) => (
              <Route key={route.name} path={route.path} element={route.element} />
            ))}
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<HomeLayout toastRef={toastRef} />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            {AdminRoutes.map((route) => (
              <Route key={route.name} path={route.path} element={route.element} />
            ))}
          </Route>
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

export default AppRoutes;