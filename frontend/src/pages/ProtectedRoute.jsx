import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("jwtToken");

  // If no token, redirect to the login page
  if (!token) {
    console.log("No token found");
    return <Navigate to="/login" replace />;
  }

  // If token exists, allow access to the children component (Dashboard in this case)
  return children;
};

export default ProtectedRoute;
