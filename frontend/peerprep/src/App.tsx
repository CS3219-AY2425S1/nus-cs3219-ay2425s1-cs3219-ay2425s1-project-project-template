import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginController from "./pages/user/controllers/LoginController";
import QuestionController from "./pages/question/QuestionController";
import RegistrationController from "./pages/user/controllers/RegistrationController";
import ForgetPasswordController from './pages/user/controllers/ForgetPasswordController';
import ResetPasswordController from './pages/user/controllers/ResetPasswordController';
import PrivateRoutes from "./utils/PrivateRoutes";
import { initApi } from "./utils/api";

const App: React.FC = () => {
  const [isAuth, setAuth] = React.useState(
    localStorage.getItem("token") ? true : false
  );

  const api = initApi(setAuth);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginController setAuth={setAuth} />} />
        <Route element={<PrivateRoutes isAuth={isAuth} api={api} />}>
          {/* Put axios api instance into a context */}
          <Route path="/questions" element={<QuestionController />} />
        </Route>
        <Route path="/register" element={<RegistrationController />} />
        <Route path="/forget-password" element={<ForgetPasswordController />} />
        <Route path="/reset-password" element={<ResetPasswordController />} />
      </Routes>
    </Router>
  );
};

export default App;
