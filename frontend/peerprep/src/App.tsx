import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginController from './pages/user/controllers/LoginController';
import QuestionController from './pages/question/QuestionController';
import RegistrationController from './pages/user/controllers/RegistrationController';
import ForgetPasswordController from './pages/user/controllers/ForgetPasswordController';
import ResetPasswordController from './pages/user/controllers/ResetPasswordController';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginController />} />
        <Route path="/register" element={<RegistrationController />} />
        <Route path="/questions" element={<QuestionController />} />
        <Route path="/forget-password" element={<ForgetPasswordController />} />
        <Route path="/reset-password" element={<ResetPasswordController />} />
      </Routes>
    </Router>
  );
};

export default App;
