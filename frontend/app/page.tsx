"use client";

import { useState } from 'react';
import { Stack, Input, Text, Button, FormControl, FormLabel } from '@chakra-ui/react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleSubmit = () => {
    alert(`Email: ${email}\nPassword: ${password}`);
    setEmail('');
    setPassword('');
  };
  const handleForgotPassword = () => alert('Forgot Password clicked');
  const handleSignUp = () => alert('Sign Up clicked');
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="flex items-center justify-evenly min-h-screen bg-[#2C5282]">
      <Stack align="start">
        <Text fontSize='50px' color='white' as='b'>{'{PeerPrep}'}</Text>
        <Text fontSize='30px' color='white'>Master Interviews Together!</Text>
      </Stack>
      <Stack spacing={4} className='bg-[#E2E8F0] p-7 rounded-lg' width='450px'>
        <Text fontSize='20px' color='black' as='b' mb='10px'>Login</Text>
        <FormControl>
          <FormLabel fontSize='15px' color='black'>Email Address or Username</FormLabel>
          <Input 
            placeholder='Enter your email address or username' 
            value={email} 
            onChange={handleEmailChange} 
            bg='white'
            size='md'
          />
        </FormControl>
        <FormControl>
          <FormLabel fontSize='15px' color='black'>Password</FormLabel>
          <Input 
            placeholder='Enter your password' 
            type='password' 
            value={password} 
            onChange={handlePasswordChange} 
            onKeyDown={handleKeyDown}
            bg='white'
            size='md'
          />
        </FormControl>
        <Button colorScheme='blue' onClick={handleSubmit} mt='30px' mb='20px'>Login</Button>
        <Stack align="center">
          <Button variant="link" onClick={handleForgotPassword} fontSize='10px' color='black' textDecoration='underline'>Forgot Password?</Button>
          <Stack direction="row" spacing={1}>
            <Text fontSize='10px' color='black'>Don't have an account?</Text>
            <Button variant="link" onClick={handleSignUp} fontSize='10px' color='black' textDecoration='underline'>Sign up</Button>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
}
