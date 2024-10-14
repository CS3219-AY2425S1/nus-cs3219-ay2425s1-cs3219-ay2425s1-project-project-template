import { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  accessToken: string;
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

export const userToString = (user: User | undefined): string => {
  if(!user) {
    /* user is undefined */
    return "undefined";
  }
  return `Access Token: ${user.accessToken},
   User(ID: ${user.id},
   Username: ${user.username},
   Email: ${user.email},
   Is Admin: ${user.isAdmin})`;
};

// Create user context
const UserContext = createContext<{
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
} | undefined>(undefined);

// Create a provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | undefined>(undefined);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};