import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROUTES } from '@/lib/routes';
import { signUpStore } from '@/stores/signup-store';

export function SignUpForm() {
  useEffect(() => {
    signUpStore.resetForm();
  }, []);

  return (
    <Card className='bg-primary-foreground border-border mx-auto flex size-full max-w-sm flex-col justify-center border'>
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
      </CardContent>

      {/* CTA to Login Form Section */}
      <CardFooter className='mx-auto text-center text-sm'>
        <span>Have an account already?&nbsp;</span>
        <a href={ROUTES.LOGIN} className='underline'>
          Log in
        </a>
      </CardFooter>
    </Card>
  );
}
