import { createBrowserRouter } from 'react-router-dom';

import { Root } from '@/routes/root';
import { Login } from '@/routes/login';
import { Layout } from '@/components/blocks/layout';
import { PrivateRoute } from '@/components/blocks/private-route';
import { SignUp } from '@/routes/signup';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: (
          <PrivateRoute>
            <Root />
          </PrivateRoute>
        ),
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <SignUp />,
      },
    ],
  },
]);
