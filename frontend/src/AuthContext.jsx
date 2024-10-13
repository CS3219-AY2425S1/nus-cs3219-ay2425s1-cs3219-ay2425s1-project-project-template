import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem('accessToken') || null;
  });
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('userId') || null;
  });
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || null;
  });
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('email') || null;
  });

  const login = (token, id, userName, userEmail) => {
    setAccessToken(token);
    setUserId(id);
    setUsername(userName); // Store the username
    setEmail(userEmail); // Store the email
    localStorage.setItem('accessToken', token); 
    localStorage.setItem('userId', id); 
    localStorage.setItem('username', userName); // Store username in localStorage
    localStorage.setItem('email', userEmail); // Store email in localStorage
  };

  const logout = () => {
    setAccessToken(null);
    setUserId(null);
    setUsername(null); // Clear username on logout
    setEmail(null); // Clear email on logout
    localStorage.removeItem('accessToken'); 
    localStorage.removeItem('userId'); 
    localStorage.removeItem('username'); // Remove username from localStorage
    localStorage.removeItem('email'); // Remove email from localStorage
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const id = localStorage.getItem('userId');
    const userName = localStorage.getItem('username');
    const userEmail = localStorage.getItem('email');

    if (token) {
      setAccessToken(token);
    }
    if (id) {
      setUserId(id);
    }
    if (userName) {
      setUsername(userName);
    }
    if (userEmail) {
      setEmail(userEmail);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, userId, username, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
