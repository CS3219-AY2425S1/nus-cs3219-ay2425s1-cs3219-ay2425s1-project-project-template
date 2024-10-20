import { Box, Group, Skeleton, Stack } from '@mantine/core';
import '@mantine/core/styles.css';

import RoomTabs from '../components/tabs/RoomTabs';

function Room() {
  return (
    <Group h="100vh" bg="slate.8" gap="10px" p="10px">
      <Stack h="100%" w="500px" gap="10px">
        <Skeleton h="150px" />
        <RoomTabs />
      </Stack>

      <Box h="100%" w="calc(100% - 510px)">
        <Skeleton h="100%" />
      </Box>
    </Group>
  );
}

export default Room;
