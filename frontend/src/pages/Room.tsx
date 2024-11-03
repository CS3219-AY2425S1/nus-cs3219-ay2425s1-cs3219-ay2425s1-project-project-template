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
import { ChatMessage } from '../components/tabs/ChatBoxTab';

function Room() {
  const [isLeaveSessionModalOpened, { open: openLeaveSessionModal, close: closeLeaveSessionModal }] = useDisclosure(false);
  const [code, setCode] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const sessionData = location.state;

  // Refs for two sockets
  const collaborationSocketRef = useRef<Socket | null>(null);
  const communicationSocketRef = useRef<Socket | null>(null);
  const isRemoteUpdateRef = useRef(false);

  useEffect(() => {
    if (!sessionData) {
      return;
    }

    const { sessionId, matchedUserId, questionId } = sessionData;
    connectCollaborationSocket(sessionId, matchedUserId, questionId);
    connectCommunicationSocket(sessionId);
  }, [sessionData]);

  // Connect Collaboration Socket
  const connectCollaborationSocket = (sessionId: string, matchedUserId: string, questionId: number) => {
    if (collaborationSocketRef.current) {
      collaborationSocketRef.current.disconnect();
    }

    const token = localStorage.getItem('token');

    collaborationSocketRef.current = io(config.ROOT_BASE_API, {
      path: '/api/collab/socket.io',
      auth: {
        token: `Bearer ${token}`,
      },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    collaborationSocketRef.current.on('connect', () => {
      collaborationSocketRef.current?.emit('join-session', {
        sessionId,
        matchedUserId,
        questionId,
      });
    });

    collaborationSocketRef.current.on('load-code', (newCode) => {
      setCode(newCode);
    });

    collaborationSocketRef.current.on('code-updated', (newCode) => {
      isRemoteUpdateRef.current = true;
      setCode(newCode);
    });

    collaborationSocketRef.current.on('user-joined', () => {
      notifications.show({
        title: 'Partner connected',
        message: 'Your practice partner has joined the room.',
        color: 'green',
      });
    });

    collaborationSocketRef.current.on('user-left', () => {
      notifications.show({
        title: 'Partner disconnected',
        message: 'Your practice partner has disconnected from the room.',
        color: 'red',
      });
    });

    collaborationSocketRef.current.on('disconnect', handleLeaveSession);
  };

  // Connect Communication Socket
  const connectCommunicationSocket = (roomId: string) => {
    const token = localStorage.getItem('token');

    communicationSocketRef.current = io(config.ROOT_BASE_API, {
      path: '/api/comm/socket.io',
      auth: { token: `Bearer ${token}` },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    communicationSocketRef.current.on('connect', () => {
      communicationSocketRef.current?.emit('joinRoom', roomId);
    });

    communicationSocketRef.current.on('loadPreviousMessages', (pastMessages: ChatMessage[]) => {
      setMessages(pastMessages);
    });

    communicationSocketRef.current.on('chatMessage', (msg: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
  };

  useEffect(() => {
    if (isRemoteUpdateRef.current) {
      isRemoteUpdateRef.current = false;
    } else {
      collaborationSocketRef.current?.emit('edit-code', code);
    }
  }, [code]);

  const handleLeaveSession = () => {
    collaborationSocketRef.current?.disconnect();
    communicationSocketRef.current?.disconnect();
    navigate('/dashboard');
  };

  const sendMessage = () => {
    if (input.trim() !== '' && communicationSocketRef.current) {
      communicationSocketRef.current.emit('chatMessage', { body: input });
      setInput('');
    }
  };

  return (
    <>
      <Group h="100vh" bg="slate.8" gap="10px" p="10px">
        <Stack h="100%" w="500px" gap="10px">
          <Group gap="10px">
            <Skeleton h="150px" w="calc(50% - 5px)" />
            <Skeleton h="150px" w="calc(50% - 5px)" />
          </Group>
          <RoomTabs
            questionId={sessionData.questionId}
            sessionId={sessionData.sessionId}
            token={localStorage.getItem('token') || ''}
            messages={messages}
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
          />
        </Stack>

        <CodeEditorLayout
          openLeaveSessionModal={openLeaveSessionModal}
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
