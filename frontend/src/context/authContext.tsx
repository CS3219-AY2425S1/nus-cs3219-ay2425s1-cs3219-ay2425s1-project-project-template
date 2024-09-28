'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { checkAuthStatus, AuthStatus } from '@/utils/checkAuth';

interface AuthContextType extends AuthStatus {
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Custom hook to access authentication context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Provider component to wrap the application and provide auth status
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const refreshAuth = async () => {
    const status = await checkAuthStatus();
    setIsAuthenticated(status.isAuthenticated);
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
