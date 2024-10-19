import { BACKEND_URL_AUTH } from '@/lib/common';
import {
  LOCAL_STORAGE_KEYS,
  LoginResponse,
  LoginResponseSchema,
  LoginUser,
} from '@/types/auth';
import { useMutation } from '@tanstack/react-query';

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginUser>({
    mutationFn: async (data: LoginUser) => {
      const dataForBackend = {
        email: data.email,
        password: data.password,
      };

      const response = await fetch(`${BACKEND_URL_AUTH}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataForBackend),
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const dataResponse = await response.json();
      const loginResponse = LoginResponseSchema.parse(dataResponse);
      localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, loginResponse.token);
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.USER_ID,
        loginResponse.id.toString()
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.EXPIRES_IN,
        loginResponse.expiresIn.toString()
      );

      return loginResponse;
    },
  });
}
