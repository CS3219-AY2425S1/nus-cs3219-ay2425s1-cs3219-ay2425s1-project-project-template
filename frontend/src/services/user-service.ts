import type { IForgotPasswordPayload, ILoginPayload, ISignUpPayload } from '@/types/user-types';
import { userApiClient } from './api-clients';

const USER_SERVICE_ROUTES = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  SIGNUP: '/auth/register',
  FORGOT_PASSWORD: '',
};

export const login = (userCredentials: ILoginPayload) => {
  return userApiClient.post(USER_SERVICE_ROUTES.LOGIN, userCredentials);
};

export const signUp = (signUpPayload: ISignUpPayload) => {
  return userApiClient.post(USER_SERVICE_ROUTES.SIGNUP, signUpPayload);
};

export const forgotPassword = (forgotPasswordPayload: IForgotPasswordPayload) => {
  return userApiClient.post(``, forgotPasswordPayload);
};
