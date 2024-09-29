import { Navigate, Outlet } from "react-router-dom";
import { ApiContext } from "../context/ApiContext";
import { AxiosInstance } from "axios";

import Navbar from "../components/layout/Navbar";
import { ToastContainer } from "react-toastify";
import Page from "../components/layout/Page";
import { UserProvider } from "../context/UserContext";

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
      <UserProvider isAuth={isAuth}>
        <ToastContainer />
        <Navbar />
        <Page>
          <Outlet />
        </Page>
      </UserProvider>
    </ApiContext.Provider>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoutes;
