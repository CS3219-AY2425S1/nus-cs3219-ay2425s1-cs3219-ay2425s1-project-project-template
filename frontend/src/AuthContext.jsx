import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';  // Import js-cookie for cookie management

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Use cookies to store accessToken and userId
  const [accessToken, setAccessToken] = useState(() => {
    return Cookies.get('accessToken') || null;  // Get token from cookies
  });
  const [userId, setUserId] = useState(() => {
    return Cookies.get('userId') || null;  // Get userId from cookies
  });

  const login = (token, id) => {
    setAccessToken(token);
    setUserId(id);
    Cookies.set('accessToken', token, { expires: 7 });  // Set token cookie for 7 days
    Cookies.set('userId', id, { expires: 7 });  // Set userId cookie for 7 days
  };

  const logout = () => {
    setAccessToken(null);
    setUserId(null);
    Cookies.remove('accessToken');  // Remove token cookie
    Cookies.remove('userId');  // Remove userId cookie
  };

  // Sync state with cookies on app load
  useEffect(() => {
    const token = Cookies.get('accessToken');  // Retrieve token from cookies
    const id = Cookies.get('userId');  // Retrieve userId from cookies

    if (token) {
      setAccessToken(token);
    }
    if (id) {
      setUserId(id);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
