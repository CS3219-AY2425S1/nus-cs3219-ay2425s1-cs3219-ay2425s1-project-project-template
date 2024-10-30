import {
  AppShell,
  Button,
  Group,
  Container,
  Paper,
  Text,
  Stack,
  Title,
  PasswordInput,
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
  const [passwordVisible, setPasswordVisible] = useState(false);
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
      <Paper shadow="md" p="xl" withBorder>
        <Group justify="center" mb="xl">
          <Title order={2}>{username}</Title>
          <Button onClick={openEditModal}>Edit Profile</Button>
        </Group>

        <Stack justify="md">
          <Paper withBorder p="md">
            <Title order={4} mb="xs">Email</Title>
            <Text>{email}</Text>
          </Paper>
          <Paper withBorder p="md">
            <Title order={4} mb="xs">Password</Title>
            <PasswordInput
              value={password}
              readOnly
              visible={passwordVisible}
              onVisibilityChange={setPasswordVisible}
              variant="unstyled"
              styles={(theme) => ({
                innerInput: {
                  fontSize: theme.fontSizes.md,
                  padding: 0,
                  height: 'auto',
                },
                visibilityToggle: {
                  top: 0,
                  bottom: 0,
                  right: 0,
                },
              })}
            />
          </Paper>
          <Paper withBorder p="md">
            <Title order={4} mb="xs">Last Login</Title>
            <Text>{new Date(lastLogin).toLocaleString()}</Text>
          </Paper>
        </Stack>
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
