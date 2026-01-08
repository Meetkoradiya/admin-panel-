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
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
