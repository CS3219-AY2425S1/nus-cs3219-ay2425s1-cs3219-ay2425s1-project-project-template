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

interface SignUpModalProps {
  isSignUpModalOpened: boolean;
  closeSignUpModal: () => void;
}

function SignUpModal({
  isSignUpModalOpened,
  closeSignUpModal,
}: SignUpModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const handleSubmit = () => {
    console.log('sign up');
  };

  return (
    <Modal
      opened={isSignUpModalOpened}
      onClose={closeSignUpModal}
      withCloseButton={false}
      centered
    >
      <form onSubmit={handleSubmit}>
        <Stack ta="center" p="16px">
          <Title order={3}>Sign up now</Title>
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
          <PasswordInput
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            placeholder="Confirm password"
          />
          <Button type="submit">Sign up</Button>
          <Text>
            Already have an account? <b>Log in now</b>
          </Text>
        </Stack>
      </form>
    </Modal>
  );
}

export default SignUpModal;
