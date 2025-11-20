import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!role) {
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }

  // 3. Role not allowed → unauthorized page
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Verified → render child routes
  return <Outlet />;
}
