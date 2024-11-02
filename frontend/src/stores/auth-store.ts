import { createContext, useContext } from 'react';

const AuthStore = createContext<{ userId: string; username: string }>({ userId: '', username: '' });

export const AuthStoreProvider = AuthStore.Provider;

export const useUser = () => {
  const { userId, username } = useContext(AuthStore);
  return {
    userId,
    username,
  };
};
