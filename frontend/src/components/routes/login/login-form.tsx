import { observer } from 'mobx-react';
import { useEffect } from 'react';

import { Logo } from '@/components/common/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROUTES } from '@/lib/routes';
import { loginStore } from '@/stores/login-store';

export const LoginForm = observer(() => {
  useEffect(() => {
    loginStore.resetForm();
  }, []);

  return (
    <Card className='bg-primary-foreground mx-auto flex size-full max-w-sm flex-col justify-center'>
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
          <Button className='w-full' onClick={() => loginStore.submitForm()}>
            Login
          </Button>
        </div>
      </CardContent>
      <CardFooter className='mx-auto text-center text-sm'>
        <span>Don&apos;t have an account?&nbsp;</span>
        <a href={ROUTES.SIGNUP} className='underline'>
          Sign up
        </a>
      </CardFooter>
    </Card>
  );
});
