import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { login, getUserProfile, updateUserProfile, forgotPassword} from '../apis/AuthApi';
import { AuthResponse, LoginInput, UpdateProfileInput, Profile } from '../types/Api';

type AuthContextProps = {
  token: string | null;
  userId: string | null;
  userProfile: Profile | null;
  loginAction: (
    loginInput: LoginInput,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
  ) => Promise<void>;
  logOutAction: () => void;
  getProfileAction: (setError: React.Dispatch<React.SetStateAction<string | null>>) => Promise<void>;
  updateProfileAction: (
    profileData: UpdateProfileInput,
    setError: React.Dispatch<React.SetStateAction<string | null>>
  ) => Promise<void>;
  forgotPasswordAction: (
    email: string,
    setError: React.Dispatch<React.SetStateAction<string | null>>
  ) => Promise<void>;
};

const AuthContext = createContext<AuthContextProps>({
  token: null,
  userId: null,
  userProfile: null,
  loginAction: () => Promise.resolve(),
  logOutAction: () => {},
  getProfileAction: () => Promise.resolve(),
  updateProfileAction: () => Promise.resolve(),
  forgotPasswordAction: () => Promise.resolve(),
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token') || null,
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const navigate = useNavigate();

  const loginAction = async (
    loginInput: LoginInput,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    login(loginInput).then(
      (response: AuthResponse) => {
        setError(null);
        setToken(response.token);
        localStorage.setItem('token', response.token);
        setUserId(response.userId);
        navigate('../select');
      },
      (error: any) => {
        setError(error);
      },
    );
  };

  const logOutAction = () => {
    setToken(null);
    localStorage.removeItem('token');
    setUserId(null);
    navigate('/');
  };

  const getProfileAction = async (
    setError: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    getUserProfile()
      .then((response) => {
        setError(null);
        setUserProfile(response); // Assuming response contains user profile data
        console.log("Fetched user profile successfully:", response);
      })
      .catch((error) => {
        setError(error);
      });
  };

  const updateProfileAction = async (
    profileData: UpdateProfileInput,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    updateUserProfile(profileData)
      .then((response) => {
        setError(null);
        console.log("Profile updated successfully:", response);
      })
      .catch((error: any) => {
        setError(error);
      });
  };

  const forgotPasswordAction = async (
    email: string,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    forgotPassword({ email })
      .then((response) => {
        setError(null);
        console.log("Password reset email sent successfully:", response);
      })
      .catch((error) => {
        setError(error);
      });
  };

  return (
    <AuthContext.Provider value={{ token, userId, userProfile, loginAction, logOutAction, getProfileAction, updateProfileAction, forgotPasswordAction }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
