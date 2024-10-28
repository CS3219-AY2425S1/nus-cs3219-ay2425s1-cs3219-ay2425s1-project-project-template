import { Button, Stack, Text, Title, UnstyledButton } from '@mantine/core';

interface PracticeLayoutProps {
  openHelpModal: () => void;
}

function PracticeLayout({ openHelpModal }: PracticeLayoutProps) {
  return (
    <Stack
      justify="space-between"
      p="20px"
      bg="slate.8"
      style={{ borderRadius: '4px' }}
    >
      <Title order={2} ta="start">
        Practice Now
      </Title>
      <Button>Start Interview</Button>
      <Text ta="center">
        Not sure how this works?{' '}
        <UnstyledButton fw={700} onClick={openHelpModal}>
          Learn now
        </UnstyledButton>
      </Text>
    </Stack>
  );
}

export default PracticeLayout;
