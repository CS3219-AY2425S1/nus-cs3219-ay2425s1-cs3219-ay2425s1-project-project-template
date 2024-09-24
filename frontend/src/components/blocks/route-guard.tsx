import { checkIsAuthed } from '@/services/user-service';
import { useQuery } from '@tanstack/react-query';
import { Navigate, Outlet } from 'react-router-dom';
import { Loading } from './loading';

export const RouteGuard = ({ authedRoute }: { authedRoute: boolean }) => {
  const { data: isAuthed, isLoading } = useQuery({
    queryKey: ['isAuthed'],
    queryFn: async ({ signal }) => {
      return await checkIsAuthed({ signal });
    },
  });
  return isLoading ? (
    <Loading />
  ) : isAuthed ? (
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
};
