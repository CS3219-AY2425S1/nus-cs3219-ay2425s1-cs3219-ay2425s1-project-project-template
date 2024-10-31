'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { axiosClient } from '@/network/axiosClient';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/state/useAuthStore';
import Link from 'next/link';
import { login } from '@/lib/auth';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // const type = 'user';
    if (password !== confirmPassword) {
      router.push('/signup');
      setError('Passwords do not match');
      return;
    }
    const result = await axiosClient.post('/users', {
      username: name,
      email: email,
      password: password,
    });

    if (result.request.status === 201) {
      // Auto login after account creation
      const loginResult = await axiosClient.post('/auth/login', {
        email: email,
        password: password,
      });
      const data = loginResult.data.data;
      if (loginResult.status === 200) {
        const token = data.accessToken;
        const res = await login(token);
        if (res) {
          setAuth(true, token, data);
          router.push('/');
          return;
        }
      }
      setError(data.error || 'Unable to create account');
    } else {
      setError('Username or Email already exists');
      console.error('Sign up failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-gray-800 p-8 shadow-xl">
        {error && (
          <Alert variant="destructive" className="mb-4">
            {/* <AlertCircle className="h-4 w-4" /> */}
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Create your account</h2>
          <p className="text-sm text-gray-400">
            Or
            <span className="mx-1" />
            <Link href="/signin" className="text-blue-500 hover:underline">
              Sign in to your existing account
            </Link>
          </p>
        </div>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center">
            <Checkbox
              id="terms"
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
              className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
              I agree to the{' '}
              <Link href="#" className="text-blue-500 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="#" className="text-blue-500 hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
          <Button className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800">
            Sign up
          </Button>
        </form>
      </div>
    </div>
  );
}
