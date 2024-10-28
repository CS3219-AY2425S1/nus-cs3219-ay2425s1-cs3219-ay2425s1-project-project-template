import { Group, Skeleton, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';

import CodeEditorLayout from '../components/layout/codeEditorLayout/CodeEditorLayout';
import LeaveSessionModal from '../components/modal/LeaveSessionModal';
import RoomTabs from '../components/tabs/RoomTabs';

function Room() {
  const [
    isLeaveSessionModalOpened,
    { open: openLeaveSessionModal, close: closeLeaveSessionModal },
  ] = useDisclosure(false);

  const [code, setCode] = useState('');

  //   const navigate = useNavigate();
  const location = useLocation();
  const matchData = location.state;

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!matchData) {
      return;
    }

    const { roomId, userId, matchUserId } = matchData;
    connectSocket(roomId, userId, matchUserId);
  }, [matchData]);

  const connectSocket = (
    sessionId: string,
    userId: string,
    matchedUserId: string,
  ) => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const token = localStorage.getItem('token');

    socketRef.current = io('http://localhost', {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
      path: '/api/collab/socket.io',
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      socketRef.current?.emit('join-session', {
        sessionId,
        userId,
        matchedUserId,
      });
    });

    socketRef.current.on('load-code', (newCode) => {
      setCode(newCode);
    });

    socketRef.current.on('code-updated', (newCode) => {
      setCode(newCode);
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
    socketRef.current?.emit('edit-code', code);
  }, [code]);

  const handleLeaveSession = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    // navigate('/dashboard');
  };

  return (
    <>
      <Group h="100vh" bg="slate.8" gap="10px" p="10px">
        <Stack h="100%" w="500px" gap="10px">
          <Group gap="10px">
            <Skeleton h="150px" w="calc(50% - 5px)" />
            <Skeleton h="150px" w="calc(50% - 5px)" />
          </Group>
          <RoomTabs />
        </Stack>

        <CodeEditorLayout
          openLeaveSessionModal={openLeaveSessionModal}
          code={code}
          setCode={setCode}
        />
      </Group>

      <LeaveSessionModal
        isLeaveSessionModalOpened={isLeaveSessionModalOpened}
        closeLeaveSessionModal={closeLeaveSessionModal}
        handleLeaveSession={handleLeaveSession}
      />
    </>
  );
}

export default Room;
