import { AppShell, Center, Group, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import Header from '../components/header/Header';
import FavoriteTopicsLayout from '../components/layout/dashboardLayout/FavoriteTopicsLayout';
import PracticeLayout from '../components/layout/dashboardLayout/PracticeNowLayout';
import ProgressLayout from '../components/layout/dashboardLayout/ProgressLayout';
import HelpModal from '../components/modal/HelpModal';
import PracticeHistoryTable from '../components/table/PracticeHistoryTable';

function Dashboard() {
  const [isHelpModalOpened, { open: openHelpModal, close: closeHelpModal }] =
    useDisclosure(false);
  return (
    <>
      <AppShell withBorder={false} header={{ height: 80 }}>
        <Header />

        <AppShell.Main h="calc(100vh - 80px)" w="100%" bg="slate.9">
          <Center>
            <Stack h="100%" gap="20px" p="20px">
              <Group gap="20px" align="stretch">
                <ProgressLayout />
                <FavoriteTopicsLayout />
                <PracticeLayout openHelpModal={openHelpModal} />
              </Group>

              <PracticeHistoryTable />
            </Stack>
          </Center>
        </AppShell.Main>
      </AppShell>

      <HelpModal
        isHelpModalOpened={isHelpModalOpened}
        closeHelpModal={closeHelpModal}
      />
    </>
  );
}

export default Dashboard;
