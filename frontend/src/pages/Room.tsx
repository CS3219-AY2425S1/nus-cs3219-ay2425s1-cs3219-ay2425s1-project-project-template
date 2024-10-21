import { Group, Skeleton, Stack } from '@mantine/core';
import '@mantine/core/styles.css';

import CodeEditor from '../components/layout/codeEditor/CodeEditor';
import RoomTabs from '../components/tabs/RoomTabs';

function Room() {
  return (
    <Group h="100vh" bg="slate.8" gap="10px" p="10px">
      <Stack h="100%" w="500px" gap="10px">
        <Group gap="10px">
          <Skeleton h="150px" w="calc(50% - 5px)" />
          <Skeleton h="150px" w="calc(50% - 5px)" />
        </Group>
        <RoomTabs />
      </Stack>

      <CodeEditor />
    </Group>
  );
}

export default Room;
