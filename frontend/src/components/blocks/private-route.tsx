import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { checkIsAuthed } from '@/services/user-service';

import { Loading } from './loading';

export const PrivateRoute: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState('pending');
  const [isAuthed, setIsAuthed] = useState(false);
  useEffect(() => {
    const ensureAuthed = async () => {
      try {
        const isAuthed = await checkIsAuthed();
        setIsAuthed(isAuthed);
      } catch (error) {
        setIsAuthed(false);
      }
      setState('loaded');
    };
    ensureAuthed();
  }, []);
  return state === 'pending' ? <Loading /> : isAuthed ? children : <Navigate to='/login' />;
};
