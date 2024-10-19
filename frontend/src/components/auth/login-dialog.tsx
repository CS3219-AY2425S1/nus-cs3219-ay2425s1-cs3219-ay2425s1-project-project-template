import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLogin } from '@/hooks/auth/useLogin';
import { useState } from 'react';
import { toast } from 'sonner';

export default function LoginDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('signup');
  const loginMutation = useLogin();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (activeTab === 'login') {
      try {
        await loginMutation.mutateAsync({ email, password });
        setIsOpen(false);
        toast.success('Login successful');
        // Refresh the page after successful login
        window.location.reload();
      } catch (error) {
        console.error('Login failed:', error);
        toast.error('Login failed');
      }
    } else {
      // Handle signup logic here
      console.log('Signup with:', email, password);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Login / Sign Up</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
          <DialogDescription>
            Login or create a new account to get started.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='signup'>Sign Up</TabsTrigger>
            <TabsTrigger value='login'>Login</TabsTrigger>
          </TabsList>
          <TabsContent value='signup'>
            <form onSubmit={handleSubmit}>
              <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='email' className='text-right'>
                    Email
                  </Label>
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    className='col-span-3'
                    required
                  />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='password' className='text-right'>
                    Password
                  </Label>
                  <Input
                    id='password'
                    name='password'
                    type='password'
                    className='col-span-3'
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type='submit'>Sign Up</Button>
              </DialogFooter>
            </form>
          </TabsContent>
          <TabsContent value='login'>
            <form onSubmit={handleSubmit}>
              <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='email' className='text-right'>
                    Email
                  </Label>
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    className='col-span-3'
                    required
                  />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='password' className='text-right'>
                    Password
                  </Label>
                  <Input
                    id='password'
                    name='password'
                    type='password'
                    className='col-span-3'
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type='submit' disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? 'Logging in...' : 'Login'}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
