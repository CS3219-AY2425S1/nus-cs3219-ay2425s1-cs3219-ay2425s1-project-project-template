import { Navigate, Outlet } from 'react-router-dom';

export function PrivateRoute() {
  //const isAuthenticated = checkUserAuthentication();
  const isAuthenticated = true;
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />;
}
