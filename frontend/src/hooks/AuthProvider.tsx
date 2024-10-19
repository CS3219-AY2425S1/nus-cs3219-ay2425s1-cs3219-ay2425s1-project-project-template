import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { login } from '../apis/AuthApi';

type AuthContextProps = {
  token: string;
  user: string;
  loginAction: (email: string, password: string) => Promise<void>;
  logOutAction: () => void;
};

const AuthContext = createContext<AuthContextProps>({
  token: '',
  user: '',
  loginAction: () => Promise.resolve(),
  logOutAction: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState(localStorage.getItem('login') || '');
  const [user, setUser] = useState('');
  const navigate = useNavigate();

  const loginAction = async (email: string, password: string) => {
    const data = { email, password };

    login(data).then(
      (response: any) => {
        setToken(response.data.accessToken);
        setUser(response.data.user);
        localStorage.setItem('login', response.accessToken);
        navigate('/');
      },
      (error: any) => {
        console.log(error.response);
      },
    );
  };

  const logOutAction = () => {
    setToken('');
    localStorage.removeItem('login');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOutAction }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
