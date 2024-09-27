import { Navigate, Outlet } from "react-router-dom";
import { ApiContext } from "../context/ApiContext";
import { AxiosInstance } from "axios";

import Navbar from "../components/layout/Navbar";

/**
 * Helper component to protect routes that require authentication
 */
const PrivateRoutes = ({
  isAuth,
  api,
}: {
  isAuth: boolean;
  api: AxiosInstance;
}) => {
  return isAuth ? (
    <ApiContext.Provider value={api}>
      <Navbar />
      <Outlet />
    </ApiContext.Provider>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoutes;
