import React, { useState } from "react";
import LoginView from './pages/login/LoginView';
import RegistrationView from './pages/users/RegistrationView';
import './index.css';

const App: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const toggleView = () => {
    setIsRegistering((prev) => !prev);
  };
  
  return (
    <div>
      {isRegistering ? (
        <RegistrationView onLogin={toggleView} />
      ) : (
        <LoginView onCreateAccount={toggleView} />
      )}
    </div>
  );
};

export default App;
