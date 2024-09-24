import { createBrowserRouter } from 'react-router-dom';

import { Layout } from '@/components/blocks/layout';
import { PrivateRoute } from '@/components/blocks/private-route';
import { ForgotPassword } from '@/routes/forgot-password';
import { Login } from '@/routes/login';
import { SignUp } from '@/routes/signup';
import { ROUTES } from './routes';
import { loader as qnDetailsLoader, QuestionDetails } from '@/routes/questions/details';
import { queryClient } from '@/components/providers';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <PrivateRoute />,
        children: [
          {
            path: ROUTES.QUESTION_DETAILS,
            loader: qnDetailsLoader(queryClient),
            element: <QuestionDetails />,
          },
        ],
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
