import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupPage from './pages/SignupPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupPage />} />
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);