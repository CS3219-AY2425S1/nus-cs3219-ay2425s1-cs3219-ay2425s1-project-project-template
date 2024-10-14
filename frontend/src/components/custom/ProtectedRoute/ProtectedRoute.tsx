import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = sessionStorage.getItem("authToken");

  // Check if the token exists
  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  return children; // Render the child components if authenticated
};

export default ProtectedRoute;
