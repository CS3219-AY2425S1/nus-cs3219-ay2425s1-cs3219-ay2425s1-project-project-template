import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If no token, redirect to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, allow access to the children component (Dashboard in this case)
  return children;
};

export default ProtectedRoute;
