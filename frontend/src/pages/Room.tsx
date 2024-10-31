import { Group, Skeleton, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';

import CodeEditorLayout from '../components/layout/codeEditorLayout/CodeEditorLayout';
import ConfirmationModal from '../components/modal/ConfirmationModal';
import RoomTabs from '../components/tabs/RoomTabs';
import config from '../config';

import { SupportedLanguage } from '../components/layout/codeEditorLayout/CodeEditorLayout';

function Room() {
  const [
    isLeaveSessionModalOpened,
    { open: openLeaveSessionModal, close: closeLeaveSessionModal },
  ] = useDisclosure(false);

  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<SupportedLanguage>('python');

  const navigate = useNavigate();
  const location = useLocation();
  const sessionData = location.state;

  const socketRef = useRef<Socket | null>(null);
  const isRemoteUpdateRef = useRef(false);

  useEffect(() => {
    if (!sessionData) {
      return;
    }

    const { sessionId, matchedUserId, questionId } = sessionData;
    connectSocket(sessionId, matchedUserId, questionId);
  }, [sessionData]);

  const connectSocket = (
    sessionId: string,
    matchedUserId: string,
    questionId: number,
  ) => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const token = localStorage.getItem('token');

    socketRef.current = io(config.ROOT_BASE_API, {
      path: '/api/collab/socket.io',
      auth: {
        token: `Bearer ${token}`,
      },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      socketRef.current?.emit('join-session', {
        sessionId,
        matchedUserId,
        questionId,
      });
    });

    socketRef.current.on('load-code', (newCode) => {
      setCode(newCode);
    });

    socketRef.current.on('code-updated', (newCode) => {
      isRemoteUpdateRef.current = true;
      setCode(newCode);
    });

    socketRef.current.on('load-language', (newLanguage) => {
      setLanguage(newLanguage);
    });

    socketRef.current.on('language-updated', (newLanguage) => {
      isRemoteUpdateRef.current = true;
      setLanguage(newLanguage);
    });

    socketRef.current.on('user-joined', () => {
      notifications.show({
        title: 'Partner connected',
        message: 'Your practice partner has joined the room.',
        color: 'green',
      });
    });

    socketRef.current.on('user-left', () => {
      notifications.show({
        title: 'Partner disconnected',
        message: 'Your practice partner has disconnected from the room.',
        color: 'red',
      });
    });

    socketRef.current.on('disconnect', handleLeaveSession);
  };

  useEffect(() => {
    if (isRemoteUpdateRef.current) {
      isRemoteUpdateRef.current = false;
    } else {
      socketRef.current?.emit('edit-code', code);
    }
  }, [code, language]);

  const onLanguageChange = (newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage);
    socketRef.current?.emit('edit-language', newLanguage);
  };

  const handleLeaveSession = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    navigate('/dashboard');
  };

  return (
    <>
      <Group h="100vh" bg="slate.8" gap="10px" p="10px">
        <Stack h="100%" w="500px" gap="10px">
          <Group gap="10px">
            <Skeleton h="150px" w="calc(50% - 5px)" />
            <Skeleton h="150px" w="calc(50% - 5px)" />
          </Group>
          <RoomTabs questionId={sessionData.questionId} />
        </Stack>

        <CodeEditorLayout
          openLeaveSessionModal={openLeaveSessionModal}
          language={language}
          onLanguageChange={onLanguageChange}
          code={code}
          setCode={setCode}
        />
      </Group>

      <ConfirmationModal
        isConfirmationModalOpened={isLeaveSessionModalOpened}
        closeConfirmationModal={closeLeaveSessionModal}
        handleConfirmation={handleLeaveSession}
        description="Are you sure you want to leave this session?"
        confirmationButtonLabel="Leave"
        confirmationButtonColor="red"
      />
    </>
  );
}

export default Room;
