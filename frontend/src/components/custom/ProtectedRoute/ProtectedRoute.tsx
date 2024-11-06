import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "@/lib/utils";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken();
      if (token) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };
    fetchToken();
  }, []);

  // Show a loading indicator while checking authentication status
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Render the child components if authenticated
  return children;
};

export default ProtectedRoute;
