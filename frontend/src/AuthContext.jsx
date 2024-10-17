import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';  

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => {
    return Cookies.get('accessToken') || null; 
  });
  const [userId, setUserId] = useState(() => {
    return Cookies.get('userId') || null; 
  });

  const login = (token, id) => {
    setAccessToken(token);
    setUserId(id);
    Cookies.set('accessToken', token, { expires: 7 }); 
    Cookies.set('userId', id, { expires: 7 }); 
  };

  const logout = () => {
    setAccessToken(null);
    setUserId(null);
    Cookies.remove('accessToken'); 
    Cookies.remove('userId'); 
  };

  useEffect(() => {
    const token = Cookies.get('accessToken');  
    const id = Cookies.get('userId'); 

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
