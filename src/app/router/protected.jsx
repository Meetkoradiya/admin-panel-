import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserData } from "../../redux/slice/AuthSlice";

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const userData = useSelector(selectUserData);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userData?.role)) {
    // If we require MASTER_ADMIN and the user has a native masterAdmin flag, let them pass
    if (allowedRoles.includes("MASTER_ADMIN") && userData?.masterAdmin) {
        return <Outlet />;
    }
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

