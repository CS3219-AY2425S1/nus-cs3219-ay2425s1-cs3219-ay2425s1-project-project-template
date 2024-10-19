import { BACKEND_URL_AUTH } from '@/lib/common';
import { VerifyUser } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';

export function useVerify() {
  return useMutation({
    mutationFn: async (data: VerifyUser) => {
      const response = await fetch(`${BACKEND_URL_AUTH}/verify`, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to verify user');
      }

      return response.json();
    },
  });
}
