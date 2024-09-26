import type { QueryClient } from '@tanstack/react-query';
import { Suspense } from 'react';
import {
  Await,
  defer,
  type LoaderFunctionArgs,
  Navigate,
  Outlet,
  useLoaderData,
} from 'react-router-dom';

import { usePageTitle } from '@/lib/hooks/use-page-title';
import { ROUTES } from '@/lib/routes';
import { checkIsAuthed } from '@/services/user-service';
import { Loading } from './loading';

export const loader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const route = new URL(request.url);
    const path = route.pathname;
    const authedRoutes = [ROUTES.HOME];

    return defer({
      isAuthed: await queryClient.ensureQueryData({
        queryKey: ['isAuthed'],
        queryFn: async () => {
          return await checkIsAuthed();
        },
        staleTime: ({ state: { data } }) => {
          const now = new Date();
          const expiresAt = data?.expiresAt ?? now;
          return Math.max(expiresAt.getTime() - now.getTime(), 0);
        },
      }),
      authedRoute: authedRoutes.includes(path),
      path,
    });
  };

export const RouteGuard = () => {
  const data = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>['data'];
  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={data}>
        {({ isAuthed, authedRoute, path }) => {
          usePageTitle(path);
          return isAuthed.isAuthed ? (
            authedRoute ? (
              // Route is authed and user is authed - proceed
              <Outlet />
            ) : (
              // Route is unauthed and user is authed - navigate to home
              <Navigate to='/' />
            )
          ) : authedRoute ? (
            // Route is authed, but user is not - force login
            <Navigate to='/login' />
          ) : (
            // Route is unauthed and user is not - proceed
            <Outlet />
          );
        }}
      </Await>
    </Suspense>
  );
};
