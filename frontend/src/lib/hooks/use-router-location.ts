import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { ROUTES } from '@/lib/routes';

export const useRouterLocation = () => {
  const location = useLocation();

  const { isSignUp, isLogin } = useMemo(() => {
    const { pathname } = location;
    const defaultReturn = {
      isSignUp: false,
      isLogin: false,
    };
    switch (pathname) {
      case ROUTES.LOGIN:
        return {
          ...defaultReturn,
          isLogin: true,
        };
      case ROUTES.SIGNUP:
        return {
          ...defaultReturn,
          isSignUp: true,
        };
      default:
        return defaultReturn;
    }
  }, [location]);
  return {
    location,
    isLogin,
    isSignUp,
  };
};
