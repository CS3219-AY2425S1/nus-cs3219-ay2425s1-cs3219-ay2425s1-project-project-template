import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { ROUTES } from '@/lib/routes';

export const useRouterLocation = () => {
  const location = useLocation();

  const { isSignUp, isLogin, isForgotPassword } = useMemo(() => {
    const { pathname } = location;
    return {
      isSignUp: pathname === ROUTES.SIGNUP,
      isLogin: pathname === ROUTES.LOGIN,
      isForgotPassword: pathname === ROUTES.FORGOT_PASSWORD,
    };
  }, [location]);
  return {
    location,
    isLogin,
    isSignUp,
    isForgotPassword,
  };
};
