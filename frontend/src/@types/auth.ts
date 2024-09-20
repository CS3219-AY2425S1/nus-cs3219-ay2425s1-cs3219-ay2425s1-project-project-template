export interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData, navigate: (path: string) => void) => Promise<void>;
  logOut: (navigate: (path: string) => void) => void;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
