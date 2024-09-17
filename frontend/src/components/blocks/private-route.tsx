import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  //const isAuthenticated = checkUserAuthentication();
  const isAuthenticated = false;
  return isAuthenticated ? children : <Navigate to='/login' />;
}
