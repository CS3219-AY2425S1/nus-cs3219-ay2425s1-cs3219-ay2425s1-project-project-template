import { GenericAbortSignal, HttpStatusCode } from 'axios';

import type { IForgotPasswordPayload, ILoginPayload, ISignUpPayload } from '@/types/user-types';
import { userApiClient, userApiGetClient } from './api-clients';

const USER_SERVICE_ROUTES = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  SIGNUP: '/auth/register',
  FORGOT_PASSWORD: '',
  IS_AUTHED: '/auth-check/is-authed',
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

export const checkIsAuthed = async (param?: { signal: GenericAbortSignal }) => {
  const response = await userApiGetClient.get(USER_SERVICE_ROUTES.IS_AUTHED, {
    signal: param?.signal,
  });
  return response.status === HttpStatusCode.Ok;
};
