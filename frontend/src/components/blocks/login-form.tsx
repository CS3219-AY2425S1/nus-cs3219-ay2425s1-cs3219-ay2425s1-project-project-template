import { observer } from 'mobx-react';
import { Logo } from '../common/logo';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { loginStore } from '@/stores/login-store';
import { useEffect } from 'react';
import { ROUTES } from '@/lib/routes';

export const LoginForm = observer(() => {
  useEffect(() => {
    loginStore.resetForm();
  }, []);

  return (
    <Card className='bg-primary-foreground mx-auto flex h-[650px] max-h-[90%] min-w-[400px] max-w-sm flex-col justify-center'>
      <div>
        <CardHeader className='flex items-center pb-10'>
          <CardTitle className='text-3xl'>Welcome Back To</CardTitle>
          <Logo className='text-2xl' />
        </CardHeader>
        <CardContent>
          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='Email'
                value={loginStore.email}
                onChange={(e) => loginStore.setEmail(e.target.value)}
                required
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='Password'
                value={loginStore.password}
                onChange={(e) => loginStore.setPassword(e.target.value)}
                required
              />
              <div className='text-right'>
                <a href='#' className='ml-auto inline-block text-sm underline'>
                  Forgot your password?
                </a>
              </div>
            </div>
            <Button className='bg-accent-foreground w-full' onClick={() => loginStore.submitForm()}>
              Login
            </Button>
          </div>
          <div className='mt-4 text-center text-sm '>
            Don&apos;t have an account?{' '}
            <a href={ROUTES.SIGNUP} className='underline'>
              Sign up
            </a>
          </div>
        </CardContent>
      </div>
    </Card>
  );
});
