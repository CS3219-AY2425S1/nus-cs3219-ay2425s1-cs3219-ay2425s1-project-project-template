
import { createContext, FC, PropsWithChildren, useContext } from 'react';

// class AuthStore {
//   state = 'pending';
//   isAuthed = false;
//   constructor() {
//     makeAutoObservable(this);
//   }
//   async check() {
//     const controller = new AbortController();
//     let isAuthed: boolean;
//     try {
//       isAuthed = await checkIsAuthed({ signal: controller.signal });
//       this.isAuthed = isAuthed;
//     } catch (error) {
//       console.error('Request failed');
//       this.isAuthed = false;
//     }
//     this.state = 'loaded';
//   }
// }

// export type IAuthStore = AuthStore;

// export const authStore = new AuthStore();

type IAuthedState = {
  isAuthed?: boolean;
};

const isAuthedContext = createContext<IAuthedState>({});

export const AuthedContextProvider: FC<PropsWithChildren<IAuthedState>> = ({
  children,
  isAuthed,
}) => {
  return <isAuthedContext.Provider value={{ isAuthed }}>{children}</isAuthedContext.Provider>;
};

export const useIsAuthed = () => {
  const { isAuthed } = useContext(isAuthedContext);
  return { isAuthed };
};
