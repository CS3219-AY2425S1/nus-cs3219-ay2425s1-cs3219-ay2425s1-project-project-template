import { createBrowserRouter } from 'react-router-dom';

import { Layout } from '@/components/blocks/layout';
import { RouteGuard } from '@/components/blocks/route-guard';

import { ForgotPassword } from '@/routes/forgot-password';
import { Login } from '@/routes/login';
import { Landing } from '@/routes/landing';
import { SignUp } from '@/routes/signup';

import { ROUTES } from './routes';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        element: <RouteGuard authedRoute={true} />,
        children: [
          {
            path: ROUTES.HOME,
            element: <Landing />,
          },
        ],
      },
      {
        element: <RouteGuard authedRoute={false} />,
        children: [
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
