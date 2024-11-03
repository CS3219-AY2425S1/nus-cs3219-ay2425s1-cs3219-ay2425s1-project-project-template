import { Alert, Button, Modal, Stack, TextInput, Title } from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import { Notifications, notifications } from '@mantine/notifications';
import { IconAlertCircle } from '@tabler/icons-react';
import { useState } from 'react';

import { useAuth } from '../../hooks/AuthProvider';

interface ForgotPasswordModalProps {
  isForgotPasswordModalOpened: boolean;
  closeForgotPasswordModal: () => void;
}

function ForgotPasswordModal({
  isForgotPasswordModalOpened,
  closeForgotPasswordModal,
}: ForgotPasswordModalProps) {
  const [forgotPasswordError, setForgotPasswordError] = useState<string | null>(
    null,
  );
  const auth = useAuth();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
    },
    validate: {
      email: isEmail('Invalid email'),
    },
  });

  const handleForgotPasswordClick = (values: typeof form.values) => {
    auth.forgotPasswordAction(values, setForgotPasswordError);
    notifications.show({
      title: 'Success',
      message: 'Reset Password Email sent successfully!',
      color: 'blue',
    });
    closeForgotPasswordModal();
  };

  const handleCloseForgotPasswordModal = () => {
    form.reset();
    setForgotPasswordError(null);
    closeForgotPasswordModal();
  };

  return (
    <>
      <Notifications position="top-right" zIndex={9000} autoClose={2000} />
      <Modal
        opened={isForgotPasswordModalOpened}
        onClose={handleCloseForgotPasswordModal}
        withCloseButton={false}
        centered
        overlayProps={{
          blur: 4,
        }}
      >
        <form onSubmit={form.onSubmit(handleForgotPasswordClick)}>
          <Stack p="16px">
            <Title order={3} ta="center">
              Forgot Password
            </Title>
            <TextInput
              {...form.getInputProps('email')}
              key={form.key('email')}
              placeholder="Email"
            />
            {forgotPasswordError && (
              <Alert
                variant="light"
                title={forgotPasswordError}
                color="red"
                icon={<IconAlertCircle />}
              />
            )}
            <Button type="submit">Forgot Password</Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}

export default ForgotPasswordModal;
