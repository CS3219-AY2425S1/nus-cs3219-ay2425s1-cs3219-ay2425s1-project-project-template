import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import LoginController from "./pages/user/controllers/LoginController";
import QuestionController from "./pages/question/QuestionController";
import RegistrationController from "./pages/user/controllers/RegistrationController";
import PrivateRoutes from "./utils/PrivateRoutes";
import DashboardView from "./pages/dashboard/DashboardView";
import ProfileView from "./pages/profile/ProfileView";
import { initApi } from "./utils/api";

const App: React.FC = () => {
  const queryClient = new QueryClient();

  const [isAuth, setAuth] = React.useState(
    localStorage.getItem("token") ? true : false
  );

  const api = initApi(setAuth);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route element={<PrivateRoutes isAuth={isAuth} api={api} />}>
            {/* Put axios api instance into a context */}
            <Route path="/questions" element={<QuestionController />} />
            <Route path="/dashboard" element={<DashboardView />} />
            <Route path="/profile" element={<ProfileView />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" />} />
          <Route
            path="/login"
            element={<LoginController setAuth={setAuth} />}
          />
          <Route path="/register" element={<RegistrationController />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
