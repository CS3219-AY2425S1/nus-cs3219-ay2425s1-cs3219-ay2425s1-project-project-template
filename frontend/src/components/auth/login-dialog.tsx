import { AuthLoginForm } from '@/components/forms/auth-login';
import { AuthRegisterForm } from '@/components/forms/auth-register';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLogin } from '@/hooks/auth/useLogin';
import { useRegister } from '@/hooks/auth/useRegister';
import { LoginUser, RegisterUser } from '@/types/auth';
import { useState } from 'react';
import { toast } from 'sonner';

export default function LoginDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('signup');
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const handleLogin = async (data: LoginUser) => {
    try {
      await loginMutation.mutateAsync(data);
      setIsOpen(false);
      toast.success('Login successful');
      // Refresh the page after successful login
      window.location.reload();
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed');
    }
  };

  const handleSignup = async (data: RegisterUser) => {
    try {
      await registerMutation.mutateAsync(data);
      setIsOpen(false);
      toast.success('Signup successful');
    } catch (error) {
      console.error('Signup failed:', error);
      toast.error('Signup failed');
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
            <AuthRegisterForm onSubmit={handleSignup} />
          </TabsContent>
          <TabsContent value='login'>
            <AuthLoginForm onSubmit={handleLogin} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
