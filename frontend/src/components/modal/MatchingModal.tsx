import { Button, Group, Loader, Modal, Stack, Text } from '@mantine/core';
import { Notifications, notifications } from '@mantine/notifications';
import { useCallback, useEffect, useRef, useState } from 'react';

interface MatchingModalProps {
  isMatchingModalOpened: boolean;
  closeMatchingModal: () => void;
}

function MatchingModal({
  isMatchingModalOpened,
  closeMatchingModal,
}: MatchingModalProps) {
  const [timer, setTimer] = useState(0);
  const hasTimedOut = useRef(false);

  const handleTimeout = useCallback(() => {
    if (!hasTimedOut.current) {
      hasTimedOut.current = true;
      notifications.show({
        title: 'Timeout',
        message: 'We could not find a match... Exiting',
        color: 'red',
      });
      closeMatchingModal();
    }
  }, [closeMatchingModal]);

  useEffect(() => {
    let interval: number;
    if (isMatchingModalOpened) {
      setTimer(0);
      hasTimedOut.current = false;
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer + 1 >= 180) {
            handleTimeout();
            return prevTimer;
          }
          return prevTimer + 1;
        });
      }, 1000);
    } else {
      setTimer(0);
      hasTimedOut.current = false;
    }
    return () => {
      clearInterval(interval);
      hasTimedOut.current = false;
    };
  }, [isMatchingModalOpened, handleTimeout]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Notifications position="top-right" />
      <Modal
        opened={isMatchingModalOpened}
        onClose={closeMatchingModal}
        title="Finding Your Perfect Match"
        centered
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
      >
        <Stack justify="xl" align="center">
          <Group justify="center" mt="md">
            <Loader size="md" />
            <Text size="lg">{formatTime(timer)}</Text>
          </Group>
          <Button variant="light" onClick={closeMatchingModal}>
            Cancel
          </Button>
        </Stack>
      </Modal>
    </>
  );
}

export default MatchingModal;
