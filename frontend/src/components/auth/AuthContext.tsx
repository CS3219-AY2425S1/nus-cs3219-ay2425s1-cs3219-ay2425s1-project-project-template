// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { User } from "./User";

interface AuthContextType {
  user: User; // You can define a more specific type for user
  login: (response: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  const login = (response: any) => {
    const access_token = response.access_token;

    // store user data for 1 hour
    Cookies.set("access_token", access_token, { expires: 1 / 24 });
    setUser({ ...user, access_token });
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("access_token");
  };

  useEffect(() => {
    const access_token = Cookies.get("access_token");
    if (access_token) {
      setUser({ ...user, access_token });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
