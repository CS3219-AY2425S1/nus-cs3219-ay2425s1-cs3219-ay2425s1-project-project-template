import { BACKEND_URL_USERS } from '@/lib/common';
import { RegisterUser } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';

/**
 * Register a new user
 */
export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterUser) => {
      const dataForBackend = {
        email: data.email,
        password: data.password,
        username: data.username,
      };

      const response = await fetch(`${BACKEND_URL_USERS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataForBackend),
      });

      if (!response.ok) {
        throw new Error('Failed to register user');
      }

      return response.json();
    },
  });
}
