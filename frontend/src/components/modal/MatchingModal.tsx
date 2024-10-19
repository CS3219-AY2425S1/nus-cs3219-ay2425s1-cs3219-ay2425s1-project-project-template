import { Button, Group, Loader, Modal, Stack, Text } from '@mantine/core';
import { Notifications, notifications } from '@mantine/notifications';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';

interface MatchingModalProps {
  isMatchingModalOpened: boolean;
  closeMatchingModal: () => void;
  difficulty: string | null;
  topics: string[];
}

function MatchingModal({
  isMatchingModalOpened,
  closeMatchingModal,
  difficulty,
  topics,
}: MatchingModalProps) {
  const [timer, setTimer] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [matchFound, setMatchFound] = useState<any | null>(null);
  const hasTimedOut = useRef(false);

  const handleTimeout = useCallback(() => {
    if (!hasTimedOut.current) {
      hasTimedOut.current = true;
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      notifications.show({
        title: 'Timeout',
        message: 'We could not find a match... Exiting',
        color: 'red',
      });
      closeMatchingModal();
    }
  }, [closeMatchingModal, socket]);

  useEffect(() => {
    let interval: number;
    if (isMatchingModalOpened) {
      setTimer(0);
      hasTimedOut.current = false;
      setMatchFound(null);

      const newSocket = io('http://localhost:4001');

      newSocket.on('connect', () => {
        console.log('Connected to WebSocket server');
        const userId = localStorage.getItem('user_id');
        newSocket.emit('register', userId, difficulty, topics);
      });

      newSocket.on('match_found', (match) => {
        setMatchFound(match);
        notifications.show({
          title: 'Match found',
          message: 'We found a perfect match for you!',
          color: 'green',
        });
      });

      setSocket(newSocket);

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
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }

    return () => {
      clearInterval(interval);
      hasTimedOut.current = false;
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [
    isMatchingModalOpened,
    handleTimeout,
    difficulty,
    topics,
    socket,
    matchFound,
  ]);

  const handleCancel = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    closeMatchingModal();
  };

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
        onClose={handleCancel}
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
          <Button variant="light" onClick={handleCancel}>
            Cancel
          </Button>
        </Stack>
      </Modal>
    </>
  );
}

export default MatchingModal;
