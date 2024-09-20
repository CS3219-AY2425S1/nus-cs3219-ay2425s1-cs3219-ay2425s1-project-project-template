import {
  AppShell,
  Button,
  Center,
  Group,
  Modal,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import '@mantine/core/styles.css';
import { useDisclosure } from '@mantine/hooks';

import LoginModal from '../components/LoginModal';

function Landing() {
  const [isLoginModalOpened, { open: openLoginModal, close: closeLoginModal }] =
    useDisclosure(false);

  return (
    <>
      <AppShell withBorder={false} header={{ height: 80 }}>
        <AppShell.Header px="40px" py="16px" bg="slate.8">
          <Group justify="space-between">
            <a href="." className="logo">
              <Title c="white">PeerPrep</Title>
            </a>
            <Button onClick={openLoginModal}>Log in</Button>
          </Group>
        </AppShell.Header>

        <AppShell.Main h="calc(100vh - 80px)" w="100%" bg="slate.9">
          <Center h="100%" p="40px">
            <Stack
              maw="720px"
              align="center"
              justify="center"
              ta="center"
              gap="24px"
            >
              <Title size="60px" fw="800">
                Ace your tech interviews today.
              </Title>
              <Text size="xl" maw="480px">
                Match with others and practice LeetCode questions through mock
                interviews.
              </Text>
              <Button size="lg" mt="16px">
                Get started
              </Button>
            </Stack>
          </Center>
        </AppShell.Main>
      </AppShell>

      <LoginModal
        isLoginModalOpened={isLoginModalOpened}
        closeLoginModal={closeLoginModal}
      />
    </>
  );
}

export default Landing;
