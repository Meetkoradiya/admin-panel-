import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserData } from "../../redux/slice/AuthSlice";

const PublicRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const userData = useSelector(selectUserData);

  if (isAuthenticated && userData) {
    const { role, masterAdmin } = userData;

    if (role === "MASTER_ADMIN" || masterAdmin) {
      return <Navigate to="/master/dashboard" replace />;
    }

    if (role === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (role === "DRIVER") {
      // Not allowed in admin app, should probably show error or logout, but avoid infinite loop
      return <Navigate to="/" replace />;
    }

    // Default fallback to prevent infinite loop on /login
    return <Outlet />;
  }

  return <Outlet />;
};

export default PublicRoute;

