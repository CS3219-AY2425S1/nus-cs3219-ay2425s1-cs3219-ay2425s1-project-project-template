import { AppShell, Center, Group, Stack } from '@mantine/core';

import Header from '../components/Header';
import FavoriteTopicsLayout from '../components/layout/dashboardLayout/FavoriteTopicsLayout';
import PracticeLayout from '../components/layout/dashboardLayout/PracticeNowLayout';
import ProgressLayout from '../components/layout/dashboardLayout/ProgressLayout';
import PracticeHistoryTable from '../components/table/PracticeHistoryTable';

function Dashboard() {
  return (
    <AppShell withBorder={false} header={{ height: 80 }}>
      <Header />

      <AppShell.Main h="calc(100vh - 80px)" w="100%" bg="slate.9">
        <Center>
          <Stack h="100%" gap="20px" p="20px">
            <Group gap="20px" align="stretch">
              <ProgressLayout />
              <FavoriteTopicsLayout />
              <PracticeLayout />
            </Group>

            <PracticeHistoryTable />
          </Stack>
        </Center>
      </AppShell.Main>
    </AppShell>
  );
}

export default Dashboard;
