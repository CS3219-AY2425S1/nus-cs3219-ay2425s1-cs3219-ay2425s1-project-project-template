// src/context/AuthContext.tsx
import { useGoogleLogin } from "@react-oauth/google";
import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  user: any; // You can define a more specific type for user
  login: (response: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  const login = (response: any) => {
    // Perform additional login actions (e.g., storing tokens)
    setUser(response);
  };

  const logout = () => {
    setUser(null);
    // Perform additional logout actions (e.g., clearing tokens)
  };

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
