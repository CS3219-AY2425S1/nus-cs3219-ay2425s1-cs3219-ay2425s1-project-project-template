import {
  Button,
  Modal,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useState } from 'react';

interface LoginModalProps {
  isLoginModalOpened: boolean;
  closeLoginModal: () => void;
}

function LoginModal({ isLoginModalOpened, closeLoginModal }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    console.log('log in');
  };

  return (
    <Modal
      opened={isLoginModalOpened}
      onClose={closeLoginModal}
      withCloseButton={false}
      centered
    >
      <form onSubmit={handleSubmit}>
        <Stack ta="center" p="16px">
          <Title order={3}>Login</Title>
          <TextInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <Button type="submit">Log in</Button>
          <Text>
            Don't have an account yet? <b>Sign up now</b>
          </Text>
        </Stack>
      </form>
    </Modal>
  );
}

export default LoginModal;
