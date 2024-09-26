import { createBrowserRouter } from 'react-router-dom';

import { Layout } from '@/components/blocks/layout';
import { loader as routeGuardLoader, RouteGuard } from '@/components/blocks/route-guard';

import { ForgotPassword } from '@/routes/forgot-password';
import { Login } from '@/routes/login';
import { Landing } from '@/routes/landing';
import { SignUp } from '@/routes/signup';

import { ROUTES } from './routes';
import { queryClient } from './query-client';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        element: <RouteGuard />,
        loader: routeGuardLoader(queryClient),
        children: [
          {
            path: ROUTES.HOME,
            element: <Landing />,
          },
          {
            path: ROUTES.LOGIN,
            element: <Login />,
          },
          {
            path: ROUTES.SIGNUP,
            element: <SignUp />,
          },
          {
            path: ROUTES.FORGOT_PASSWORD,
            element: <ForgotPassword />,
          },
        ],
      },
    ],
  },
]);
