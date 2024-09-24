import { createBrowserRouter } from 'react-router-dom';

import { Layout, loader as rootLoader } from '@/components/blocks/layout';
import { PrivateRoute } from '@/components/blocks/private-route';

import { ForgotPassword } from '@/routes/forgot-password';
import { Login } from '@/routes/login';
import { Root } from '@/routes/root';
import { SignUp } from '@/routes/signup';

import { ROUTES } from './routes';
import { queryClient } from './query-client';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    loader: rootLoader(queryClient),
    children: [
      {
        path: ROUTES.HOME,
        element: (
          <PrivateRoute>
            <Root />
          </PrivateRoute>
        ),
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
]);
