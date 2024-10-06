import { Navigate, Outlet } from "react-router-dom";
import { ApiContext, AuthApiContext } from "../context/ApiContext";
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
  setAuth,
  authApi,
  api,
}: {
  isAuth: boolean;
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
  authApi: AxiosInstance;
  api: AxiosInstance;
}) => {
  return isAuth ? (
    <ApiContext.Provider value={api}>
      <AuthApiContext.Provider value={authApi}>
        <UserProvider isAuth={isAuth} authApi={authApi}>
          <ToastContainer />
          <Navbar setAuth={setAuth} />
          <Page>
            <Outlet />
          </Page>
        </UserProvider>
      </AuthApiContext.Provider>
    </ApiContext.Provider>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoutes;
