import {
  AppShell,
  Button,
  Group,
  Container,
  Paper,
  Text,
  Title,
} from '@mantine/core';
import '@mantine/core/styles.css';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/AuthProvider';
import { useDisclosure } from '@mantine/hooks';
import { Link } from 'react-router-dom';

import EditProfileModal from '../components/modal/EditProfileModal';

function Profile() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lastLogin, setLastLogin] = useState('');
  const [
    isEditProfileModalOpened,
    { open: openEditProfileModal, close: closeEditProfileModal },
  ] = useDisclosure(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const auth = useAuth();

  // Fetch user profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        await auth.getProfileAction(setProfileError);
        if (auth.userProfile) {
          setEmail(auth.userProfile.email);
          setUsername(auth.userProfile.username);
          setPassword('password');
          setLastLogin(auth.userProfile.lastLogin);
        }
      } catch (error) {
        console.error('Error fetching profile:', profileError);
      }
    }
    fetchProfile();
  }, [auth.userProfile]); 

  const openEditModal = () => {
    openEditProfileModal();
  };

  return (
    <>
    <AppShell withBorder={false} header={{ height: 80 }}>
      <AppShell.Header px="40px" py="16px" bg="slate.8">
        <Group justify="space-between">
          <a href="." className="logo">
            <Title c="white">PeerPrep</Title>
          </a>
          <Link to='../profile'>
            <Button>Log In</Button>
          </Link>
        </Group>
      </AppShell.Header>

      <AppShell.Main
        h="calc(100vh - 80px)"
        w="100%"
        bg="slate.9"
        style={{ overflowY: 'auto' }}
      >
        <Container size="sm" py="xl">
          <Paper shadow="md" p="xl" withBorder style={{ position: 'relative' }}>
            <Group justify="apart" mb="lg">
              <Group justify='apart'>
                <div>
                  <Text size="xl">Username: {username}</Text>
                  <Text size="sm">Email: {email}</Text>
                  <Text size="sm">Password: {password}</Text>
                  <Text size="sm">Last Login: {lastLogin}</Text>
                </div>
              </Group>
              <Button onClick={openEditModal}>
                Edit Profile
              </Button>
            </Group>
          </Paper>
        </Container>

      </AppShell.Main>
    </AppShell>

    <EditProfileModal
      isEditProfileModalOpen={isEditProfileModalOpened}
      closeEditProfileModal={closeEditProfileModal}
      initialUsername={username}
    />
</>
  );
}

export default Profile;
