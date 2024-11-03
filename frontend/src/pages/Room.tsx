import { Group, Skeleton, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { ViewUpdate } from '@uiw/react-codemirror';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';

import CodeEditorLayout from '../components/layout/codeEditorLayout/CodeEditorLayout';
import ConfirmationModal from '../components/modal/ConfirmationModal';
import RoomTabs from '../components/tabs/RoomTabs';
import config from '../config';

function Room() {
  const [
    isLeaveSessionModalOpened,
    { open: openLeaveSessionModal, close: closeLeaveSessionModal },
  ] = useDisclosure(false);

  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const sessionData = location.state;

  const socketRef = useRef<Socket | null>(null);
  const isRemoteUpdateRef = useRef(false);
  const viewUpdateRef = useRef<ViewUpdate | null>(null);

  useEffect(() => {
    if (!sessionData) return;
    const { sessionId, matchedUserId, questionId } = sessionData;
    connectSocket(sessionId, matchedUserId, questionId);
  }, [sessionData]);

  const connectSocket = (
    sessionId: string,
    matchedUserId: string,
    questionId: number,
  ) => {
    if (socketRef.current) socketRef.current.disconnect();
    const token = localStorage.getItem('token');

    socketRef.current = io(config.ROOT_BASE_API, {
      path: '/api/collab/socket.io',
      auth: { token: `Bearer ${token}` },
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

    socketRef.current.on('load-code', (newCode) => setCode(newCode));

    socketRef.current.on('code-updated', (newCode) => {
      // Capture the current cursor position as line and column
      let cursorLine = 0;
      let cursorColumn = 0;
      if (viewUpdateRef.current) {
        const { head } = viewUpdateRef.current.view.state.selection.main;
        const pos = viewUpdateRef.current.view.state.doc.lineAt(head);
        cursorLine = pos.number - 1; // Adjusting for 0-based index
        cursorColumn = head - pos.from;
      }
    
      // Update the code with the new content
      isRemoteUpdateRef.current = true;
      setCode(newCode);
    
      // Restore line and column position after the code has been updated
      setTimeout(() => {
        if (viewUpdateRef.current) {
          const line = viewUpdateRef.current.view.state.doc.line(cursorLine + 1); // Adjusting back to 1-based
          const newPos = line.from + cursorColumn;
          viewUpdateRef.current.view.dispatch({
            selection: { anchor: newPos, head: newPos },
          });
        }
      }, 5); // the delay to be set may vary from device to device
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
    if (!isRemoteUpdateRef.current) {
      socketRef.current?.emit('edit-code', code);
    }
    isRemoteUpdateRef.current = false;
  }, [code]);

  const handleLeaveSession = () => {
    socketRef.current?.disconnect();
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
          code={code}
          setCode={setCode}
          viewUpdateRef={viewUpdateRef}
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
