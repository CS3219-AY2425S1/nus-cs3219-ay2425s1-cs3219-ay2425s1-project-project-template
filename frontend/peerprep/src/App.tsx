import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginController from './pages/users/LoginController';
import QuestionController from './pages/question/QuestionController';
import RegistrationController from './pages/users/RegistrationController';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginController />} />
        <Route path="/register" element={<RegistrationController />} />
        <Route path="/questions" element={<QuestionController />} />
      </Routes>
    </Router>
  );
};

export default App;
