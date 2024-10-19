import {
  Accordion,
  AppShell,
  Button,
  Card,
  Container,
  Group,
  Modal,
  MultiSelect,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { useDisclosure } from '@mantine/hooks';
import { Notifications, notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { useEffect, useMemo, useState } from 'react';

import MatchingModal from '../components/modal/MatchingModal';

const difficulties = ['Easy', 'Medium', 'Hard'];
const topics = [
  'Strings',
  'Algorithms',
  'Bit Manipulation',
  'Data Structures',
  'Recursion',
  'Databases',
  'Arrays',
  'Brainteaser',
];

function Filter() {
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
  const [filterTopic, setFilterTopic] = useState<string[]>([]);
  const [
    isMatchingModalOpened,
    { open: openMatchingModal, close: closeMatchingModal },
  ] = useDisclosure(false);

  return (
    <>
      <AppShell withBorder={false} header={{ height: 80 }}>
        <AppShell.Header px="40px" py="16px" bg="slate.8">
          <Group justify="space-between">
            <a href="." className="logo">
              <Title c="white">PeerPrep</Title>
            </a>
            <Button>Log in</Button>
          </Group>
        </AppShell.Header>

        <AppShell.Main
          h="calc(100vh - 80px)"
          w="100%"
          bg="slate.9"
          style={{ overflowY: 'auto' }}
        >
          <Container mt="xl" size="50%">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={2}>Start Your Collaboration</Title>
              <Stack justify="apart" mb="md">
                <Select
                  description="Difficulty"
                  placeholder="Select Difficulty"
                  clearable
                  data={difficulties}
                  value={filterDifficulty}
                  onChange={setFilterDifficulty}
                  style={{ width: '300px' }}
                />
                <MultiSelect
                  description="Topic"
                  clearable
                  placeholder={filterTopic.length > 0 ? '' : 'Select Topic'}
                  data={topics}
                  value={filterTopic}
                  onChange={setFilterTopic}
                  style={{ width: '300px' }}
                />
              </Stack>
              <Button variant="light" onClick={openMatchingModal}>
                Search
              </Button>
            </Card>
          </Container>
        </AppShell.Main>
      </AppShell>

      <MatchingModal
        isMatchingModalOpened={isMatchingModalOpened}
        closeMatchingModal={closeMatchingModal}
      />
    </>
  );
}

export default Filter;
