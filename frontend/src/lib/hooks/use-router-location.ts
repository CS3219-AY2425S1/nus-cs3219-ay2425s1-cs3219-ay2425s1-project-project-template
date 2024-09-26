import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { ROUTES } from '@/lib/routes';

export const useRouterLocation = () => {
  const location = useLocation();

  const data = useMemo(() => {
    const { pathname } = location;
    return {
      isUnauthedRoute: [ROUTES.LOGIN, ROUTES.SIGNUP, ROUTES.FORGOT_PASSWORD].includes(pathname),
      isLogin: pathname === ROUTES.LOGIN,
    };
  }, [location]);
  return {
    location,
    ...data,
  };
};
