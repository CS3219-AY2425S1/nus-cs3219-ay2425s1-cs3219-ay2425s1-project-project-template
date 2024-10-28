import { Button, Stack, Text, Title, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import HelpModal from '../../modal/HelpModal';
import MatchingCriteriaModal from '../../modal/MatchingCriteriaModal';
import MatchingModal from '../../modal/MatchingModal';

interface PracticeLayoutProps {
  openHelpModal: () => void;
  openMatchingCriteriaModal: () => void;
}

function PracticeLayout({}: PracticeLayoutProps) {
  const [isHelpModalOpened, { open: openHelpModal, close: closeHelpModal }] =
    useDisclosure(false);
  const [
    isMatchingCriteriaModalOpen,
    { open: openMatchingCriteriaModal, close: closeMatchingCriteriaModal },
  ] = useDisclosure(false);
  const [
    isMatchingModalOpen,
    { open: openMatchingModal, close: closeMatchingModal },
  ] = useDisclosure(false);

  const findMatch = (difficulties: string[], topics: string[]) => {
    openMatchingModal();
  };

  return (
    <>
      <Stack
        justify="space-between"
        p="20px"
        bg="slate.8"
        style={{ borderRadius: '4px' }}
      >
        <Title order={2} ta="start">
          Practice Now
        </Title>
        <Button onClick={openMatchingCriteriaModal}>Start Interview</Button>
        <Text ta="center">
          Not sure how this works?{' '}
          <UnstyledButton fw={700} onClick={openHelpModal}>
            Learn now
          </UnstyledButton>
        </Text>
      </Stack>

      <HelpModal
        isHelpModalOpened={isHelpModalOpened}
        closeHelpModal={closeHelpModal}
      />
      <MatchingCriteriaModal
        isMatchingCriteriaModalOpened={isMatchingCriteriaModalOpen}
        closeMatchingCriteriaModal={closeMatchingCriteriaModal}
        findMatch={findMatch}
      />
      <MatchingModal
        isMatchingModalOpened={isMatchingModalOpen}
        closeMatchingModal={closeMatchingModal}
        difficulty={[]}
        topics={[]}
      />
    </>
  );
}

export default PracticeLayout;
