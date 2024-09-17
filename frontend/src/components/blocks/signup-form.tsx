import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function SignUpForm() {
  return (
    <Card className='bg-primary-foreground mx-auto flex min-h-[70%] min-w-[400px] max-w-sm flex-col justify-center'>
      <div>
        <CardHeader className='flex items-center pb-10'>
          <CardTitle className='text-3xl'>Create An Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' type='email' placeholder='Email' required />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='password'>Password</Label>
              <Input id='password' type='password' placeholder='Password' required />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='password'>Confirm Password</Label>
              <Input id='password' type='password' placeholder='Confirm Password' required />
            </div>
            <Button type='submit' className='bg-accent-foreground mt-5 w-full'>
              Sign Up
            </Button>
          </div>
          <div className='mt-4 text-center text-sm'>
            Have an acoount already?&nbsp;
            <a href='/login' className='underline'>
              Log in
            </a>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
