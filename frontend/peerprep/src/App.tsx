import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginController from './pages/login/LoginController';
import QuestionController from './pages/question/QuestionController'; // Assuming QuestionController exists

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginController />} />
        <Route path="/questions" element={<QuestionController />} />
      </Routes>
    </Router>
  );
};

export default App;
