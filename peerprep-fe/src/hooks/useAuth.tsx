import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// useAuth hook to manage auth state
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  };

  const login = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    console.log('Manage to store token: ', token);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/signin');
  };

  return { isAuthenticated, login, logout, checkAuth };
}
