import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role-based access validation
  if (
    (role === "PATIENT" && !location.pathname.startsWith("/patient")) ||
    (role === "DOCTOR" && !location.pathname.startsWith("/doctor")) ||
    (role === "ADMIN" && !location.pathname.startsWith("/admin"))
  ) {
    // Redirect user to their correct dashboard
    return <Navigate to={`/${role.toLowerCase()}/dashboard`} replace />;
  }

  return children;
}
