import React from 'react';
import { useState } from 'react';
import { FormControl, FormLabel, Input, Button, Box, Text } from '@chakra-ui/react';

function ChangePassword({ userId }) {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      // Retrieve the JWT token
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error((await response.json()).message || 'An error occurred');
      }

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <Box maxWidth="400px" margin="auto" mt={8} p={4} borderWidth="1px" borderRadius="md" boxShadow="md">
      <form onSubmit={handleChangePassword}>
        <FormControl id="password" isRequired>
          <FormLabel>New Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        
        <Button
          mt={4}
          colorScheme="blue"
          type="submit"
          width="100%"
        >
          Change Password
        </Button>

        {message && (
          <Text mt={4} color={message.includes('success') ? 'green.500' : 'red.500'}>
            {message}
          </Text>
        )}
      </form>
    </Box>
  );
}

export default ChangePassword;
