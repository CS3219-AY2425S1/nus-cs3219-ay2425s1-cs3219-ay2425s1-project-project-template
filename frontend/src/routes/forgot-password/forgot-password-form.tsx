import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/lib/routes';

import { useForgotPasswordForm } from './logic';

export const ForgotPasswordForm = () => {
  const { form, onSubmit } = useForgotPasswordForm();
  return (
    <Card className='bg-primary-foreground border-border mx-auto flex size-full max-w-sm flex-col justify-center border'>
      <CardHeader className='flex items-center text-center'>
        <CardTitle className='text-3xl'>Send Password Reset Request</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className='flex flex-col gap-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder='johnSmith@email.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='mt-4 w-full'>
              Send Request
            </Button>
          </form>
        </Form>
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
};
