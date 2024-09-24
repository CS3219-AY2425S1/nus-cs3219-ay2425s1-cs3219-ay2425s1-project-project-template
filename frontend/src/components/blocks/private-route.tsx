import { useIsAuthed } from '@/stores/auth-store';
import { FC, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

export const PrivateRoute: FC<PropsWithChildren> = ({ children }) => {
  const { isAuthed } = useIsAuthed();
  return isAuthed ? children : <Navigate to='/login' />;
};
