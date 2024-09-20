import type { IForgotPasswordPayload, ILoginPayload, ISignUpPayload } from '@/types/user-types';
import { userApiClient } from './api-clients';

export const login = (userCredentials: ILoginPayload) => {
  return userApiClient.post(`/login`, userCredentials);
};

export const signUp = (signUpPayload: ISignUpPayload) => {
  return userApiClient.post(``, signUpPayload);
};

export const forgotPassword = (forgotPasswordPayload: IForgotPasswordPayload) => {
  return userApiClient.post(``, forgotPasswordPayload);
};
