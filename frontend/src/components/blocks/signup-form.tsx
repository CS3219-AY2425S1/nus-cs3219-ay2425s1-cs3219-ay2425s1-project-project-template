import { signUpStore } from '@/stores/signup-store';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useEffect } from 'react';
import { ROUTES } from '@/lib/routes';

export function SignUpForm() {
  useEffect(() => {
    signUpStore.resetForm();
  }, []);

  return (
    <Card className='bg-primary-foreground mx-auto flex min-h-[650px] min-w-[400px] max-w-sm flex-col justify-center'>
      <div>
        <CardHeader className='flex items-center pb-10'>
          <CardTitle className='text-3xl'>Create An Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='Email'
                value={signUpStore.email}
                onChange={(e) => signUpStore.setEmail(e.target.value)}
                required
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='Password'
                value={signUpStore.password}
                onChange={(e) => signUpStore.setPassword(e.target.value)}
                required
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='password'>Confirm Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='Confirm Password'
                value={signUpStore.confirmPassword}
                onChange={(e) => signUpStore.setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button
              className='bg-accent-foreground mt-5 w-full'
              onClick={() => signUpStore.submitForm()}
            >
              Sign Up
            </Button>
          </div>
          <div className='mt-4 text-center text-sm'>
            Have an acoount already?&nbsp;
            <a href={ROUTES.LOGIN} className='underline'>
              Log in
            </a>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
