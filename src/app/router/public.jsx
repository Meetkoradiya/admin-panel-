import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserData } from "../../redux/slice/AuthSlice";

const PublicRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const userData = useSelector(selectUserData);

  if (isAuthenticated && userData) {
    const { role, masterAdmin } = userData;

    if (role === "MASTER_ADMIN") {
        if (masterAdmin === true || masterAdmin === "true") {
      return <Navigate to="/master/dashboard" replace />;
        } else {
          return <Outlet />;
        }
    }

    if (role === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (role === "DRIVER") {
      return <Navigate to="/login" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
