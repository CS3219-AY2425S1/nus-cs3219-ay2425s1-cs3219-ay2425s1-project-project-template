'use client';
import { Suspense, useEffect, useRef } from 'react';
import { LoadingSpinner } from '@/components/ui/loading';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/state/useAuthStore';
import { handleOAuthCallback } from '@/lib/oauth';

// Separate the component that uses useSearchParams
function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const hasProcessed = useRef(false);

  /**
   * Known issue: in dev mode, this will be called twice
   * Github OAuth code is single use to prevent abuse from malicious users,
   * so when `handleOAuthCallback` is called twice, one of the calls will succeed
   * and the other will fail. To prevent this, we have a ref to force it to only
   * execute once
   */
  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

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
    <div className="text-center text-white">
      <LoadingSpinner />
      <h2 className="mt-4 text-xl font-semibold">
        Processing authentication...
      </h2>
      <p className="text-gray-400">
        Please wait while we complete your sign-in.
      </p>
    </div>
  );
}

// Main component wrapped with Suspense
export default function OAuthCallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <Suspense
        fallback={
          <div className="text-center text-white">
            <LoadingSpinner />
            <p>Loading...</p>
          </div>
        }
      >
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
