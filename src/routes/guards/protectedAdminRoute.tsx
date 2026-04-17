import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";

function ProtectedAdminRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export default ProtectedAdminRoute;
