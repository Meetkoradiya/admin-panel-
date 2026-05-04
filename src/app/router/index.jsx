import React, { useRef } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoute from "./public";
import ProtectedRoute from "./protected";
import { AdminRoutes, MasterRoutes, PublicRoutes } from "./router";
import HomeLayout from "../layout/HomeLayout/HomeLayout";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOtp from "../pages/auth/VerifyOtp";
import CreateNewPassword from "../pages/auth/CreateNewPassword";
import NotFound from "../pages/error/NotFound";

const AppRoutes = () => {
  const toastRef = useRef(null);
  return (
    <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-slate-50"><i className="pi pi-spin pi-spinner text-3xl text-blue-500"></i></div>}>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route index element={<Navigate to="/login" replace />} />
          {PublicRoutes.map((route) => (
            <Route key={route.name} path={route.path} element={route.element} />
          ))}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/create-new-password" element={<CreateNewPassword />} />
          <Route path="/unauthorized" element={<NotFound type="401" />} />
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

        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Suspense>
  );
};

export default AppRoutes;