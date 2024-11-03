import { AppShell, PasswordInput } from '@mantine/core';
import {
  Alert,
  Button,
  Container,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { hasLength, matchesField, useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/AuthProvider';

function ResetPassword() {
  const [resetPasswordErrorMessage, setErrorMessage] = useState<string | null>(
    null,
  );
  const navigate = useNavigate();
  const auth = useAuth();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      password: '',
      passwordConfirmation: '',
    },
    validate: {
      password: hasLength(
        { min: 5 },
        'Password must have 5 or more characters',
      ),
      passwordConfirmation: matchesField('password', 'Password does not match'),
    },
  });

  const handlePasswordReset = async (values: typeof form.values) => {
    try {
      setErrorMessage(null);
      await auth.resetPasswordAction(values, setErrorMessage);
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  return (
    <>
      <AppShell withBorder={false} header={{ height: 80 }}>
        <AppShell.Main h="calc(100vh - 80px)" w="100%" bg="slate.9">
          <Container size="xs" py="xl">
            <Paper shadow="md" p="xl" withBorder>
              <Title order={2} mb="lg">
                Set New Password
              </Title>

              <form onSubmit={form.onSubmit(handlePasswordReset)}>
                <Stack p="16px">
                  <Text>Enter New Password</Text>
                  <PasswordInput
                    {...form.getInputProps('password')}
                    key={form.key('password')}
                    placeholder=""
                  />
                  <Text>Confirm New Password</Text>
                  <PasswordInput
                    {...form.getInputProps('passwordConfirmation')}
                    key={form.key('passwordConfirmation')}
                    placeholder=""
                  />
                  {resetPasswordErrorMessage && (
                    <Alert
                      variant="light"
                      title={resetPasswordErrorMessage}
                      color="red"
                      icon={<IconAlertCircle />}
                    />
                  )}
                  <Button type="submit">Reset Password</Button>
                </Stack>
              </form>
            </Paper>
          </Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
}

export default ResetPassword;
