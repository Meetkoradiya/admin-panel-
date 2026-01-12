import React, { useRef } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoute from "./public";
import ProtectedRoute from "./protected";
import { AdminRoutes, MasterRoutes, PublicRoutes } from "./router";
import HomeLayout from "../layout/HomeLayout/HomeLayout";
// Import ForgotPassword from your auth folder
import ForgotPassword from "../pages/auth/ForgotPassword";

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
          {/* Added Forgot Password Route */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
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