import React, { useState } from 'react'
import { Box, Input, Button, VStack, Heading, FormControl, FormLabel } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const ChangePasswordPage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const navigate = useNavigate()

  const handleChangePassword = () => {
    if ((!currentPassword) || !(newPassword) || !(confirmNewPassword)) {
      alert('All fields are required.')
      return
    }
    if (newPassword !== confirmNewPassword) {
      alert('New password and confirmation do not match.')
      return
    }
    console.log('Changing Password')

    setTimeout(() => {
      alert('Password changed successfully')
      navigate('/profile')
    }, 1000)
  }

  return (
    <Box width="100%" maxWidth="600px" margin="auto" mt={8} p={4} borderRadius="8px" bg="gray.50">
      <Heading as="h2" size="lg" mb={6} textAlign="center">
        Change Password
      </Heading>
      <VStack spacing={4} align="start">
        <FormControl>
          <FormLabel>Current Password</FormLabel>
          <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}>
          </Input>
        </FormControl>
        <FormControl>
          <FormLabel>New Password</FormLabel>
          <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}>
          </Input>
        </FormControl>
        <FormControl>
          <FormLabel>Confirm New Password</FormLabel>
          <Input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)}>
          </Input>
        </FormControl>
        <Button colorScheme='blue' onClick={handleChangePassword}>
          Change Password
        </Button>
      </VStack>
    </Box>
  )
}

export default ChangePasswordPage