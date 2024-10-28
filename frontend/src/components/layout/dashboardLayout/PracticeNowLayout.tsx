import { Button, Stack, Text, Title, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';

import { useAuth } from '../../../hooks/AuthProvider';
import HelpModal from '../../modal/HelpModal';
import MatchingCriteriaModal from '../../modal/MatchingCriteriaModal';
import MatchingModal from '../../modal/MatchingModal';

function PracticeLayout() {
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

  const [displayTimer, setDisplayTimer] = useState(0);
  const timerRef = useRef(0);
  const hasTimedOut = useRef(false);
  const socketRef = useRef<Socket | null>(null);

  const timeoutTime = 30;

  const auth = useAuth();
  const navigate = useNavigate();

  const handleTimeout = () => {
    if (!hasTimedOut.current) {
      hasTimedOut.current = true;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      notifications.show({
        title: 'Matching Timeout',
        message: 'We could not find a partner for you. Please try again later.',
        color: 'red',
      });
      closeMatchingModal();
    }
  };

  useEffect(() => {
    let interval: number;
    if (isMatchingModalOpen) {
      timerRef.current = 0;
      setDisplayTimer(0);
      hasTimedOut.current = false;

      interval = setInterval(() => {
        timerRef.current += 1;
        setDisplayTimer(timerRef.current);
        if (timerRef.current >= timeoutTime) {
          handleTimeout();
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
      timerRef.current = 0;
      setDisplayTimer(0);
      hasTimedOut.current = false;
    };
  }, [isMatchingModalOpen]);

  const connectSocket = (difficulties: string[], topics: string[]) => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    socketRef.current = io('http://localhost', {
      path: '/api/matching-notification/socket.io',
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      socketRef.current?.emit('register', auth.userId, difficulties, topics);
    });

    socketRef.current.on('match_found', (match) => {
      console.log(match);
      notifications.show({
        title: 'Match found!',
        message: 'Creating a practice room...',
        color: 'green',
      });
      handleCancelMatching();
      navigate('/room', { state: match });
    });

    socketRef.current.on('disconnect', handleCancelMatching);
    socketRef.current.on('existing_search', handleCancelMatching);
  };

  const handleCancelMatching = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    closeMatchingModal();
  };

  const findMatch = (difficulties: string[], topics: string[]) => {
    openMatchingModal();
    connectSocket(difficulties, topics);
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
        closeMatchingModal={handleCancelMatching}
        displayTimer={displayTimer}
        timeoutTime={timeoutTime}
      />
    </>
  );
}

export default PracticeLayout;
