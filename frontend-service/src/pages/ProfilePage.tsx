import React, { useEffect, useState } from 'react'
import { Box, Text, Heading, VStack, Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

interface UserProfile {
  userId: string,
  email: string
}

const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    const email = localStorage.getItem("email")

    console.log("Retrieved userId:", userId)
    console.log("Retrieved email:", email)

    if (userId && email) {
      setUserProfile({ userId, email })
    } else {
      console.error("User data not found in session storage.");
    }
  }, [])

  const handleEditProfile = () => {
    navigate('/EditProfile')
  }

  return (
    <Box width="100%" maxWidth="600px" margin="auto" mt={8} p={4} borderRadius="8px" border="1px solid #e2e8f0" bg="gray.50">
      <Heading as="h2" size="lg" mb={6} textAlign="center">
        My Profile
      </Heading>
      {userProfile ? (
        <VStack spacing={4} align="start">
          <Text><strong>Email:</strong> {userProfile.email}</Text>
          <Button colorScheme="blue" onClick={handleEditProfile}>
            Edit Profile
          </Button>
        </VStack>
      ) : (
        <Text>Error loading profile...</Text>
      )}
    </Box>
  )
}

export default ProfilePage

