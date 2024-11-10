import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "@/lib/utils";
import { auth } from "@/config/firebaseConfig";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await getToken();
        setIsAuthenticated(!!token); // Set authentication status based on token
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe(); // Clean up on unmount
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
