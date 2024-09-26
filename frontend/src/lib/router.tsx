import { createBrowserRouter } from 'react-router-dom';

import { AuthedLayout } from '@/components/blocks/authed';
import { RootLayout } from '@/components/blocks/root-layout';
import { RouteGuard, loader as routeGuardLoader } from '@/components/blocks/route-guard';

import { ForgotPassword } from '@/routes/forgot-password';
import { Login } from '@/routes/login';
import { QuestionDetails, loader as questionDetailsLoader } from '@/routes/questions/details';
import { SignUp } from '@/routes/signup';

import { queryClient } from './query-client';
import { ROUTES } from './routes';
import { QuestionsList } from '@/routes/questions/list';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <RouteGuard />,
        loader: routeGuardLoader(queryClient),
        children: [
          {
            path: ROUTES.HOME,
            element: <AuthedLayout />,
            children: [
              {
                path: ROUTES.QUESTIONS,
                element: <QuestionsList />,
              },
              {
                path: ROUTES.QUESTION_DETAILS,
                loader: questionDetailsLoader(queryClient),
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
    ],
  },
]);
