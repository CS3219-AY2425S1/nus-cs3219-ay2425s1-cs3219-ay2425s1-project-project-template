'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/state/useAuthStore';
import { handleOAuthCallback } from '@/lib/oauth';

export default function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) {
      router.push('/signin?error=no_token');
      return;
    }

    handleOAuthCallback('github', code, setAuth)
      .then((isSuccess) => {
        if (!isSuccess) {
          router.push('/signin?error=auth_failed');
          return;
        }
        router.push('/');
      })
      .catch(() => {
        router.push('/signin?error=auth_failed');
      });
  }, [router, searchParams, setAuth]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      Processing authentication...
    </div>
  );
}
