import { Group, Stack, Loader, Text, Modal, Button } from '@mantine/core';
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
import { ChatMessage } from '../components/tabs/ChatBoxTab';
import VideoCall from '../components/videoCall/VideoCall';

function Room() {
  const [isLeaveSessionModalOpened, { open: openLeaveSessionModal, close: closeLeaveSessionModal }] = useDisclosure(false);
  const [code, setCode] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [modalOpened, { close: closeModal, open: openModal }] = useDisclosure(false);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();
  const sessionData = location.state;

  // Refs for two sockets
  const collaborationSocketRef = useRef<Socket | null>(null);
  const communicationSocketRef = useRef<Socket | null>(null);
  const isRemoteUpdateRef = useRef(false);
  const viewUpdateRef = useRef<ViewUpdate | null>(null);

  useEffect(() => {
    const requestMediaPermissions = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        setPermissionsGranted(true);
        setLoading(false);
      } catch (error) {
        console.error('Permissions not granted:', error);
        openModal();
      }
    };

    requestMediaPermissions();
  }, []);

  useEffect(() => {
    if (!permissionsGranted || !sessionData) {
      return;
    }

    const { sessionId, matchedUserId, questionId } = sessionData;
    connectCollaborationSocket(sessionId, matchedUserId, questionId);
    connectCommunicationSocket(sessionId);
  }, [permissionsGranted, sessionData]);

  // Connect Collaboration Socket
  const connectCollaborationSocket = (sessionId: string, matchedUserId: string, questionId: number) => {
    if (collaborationSocketRef.current) {
      collaborationSocketRef.current.disconnect();
    }

    const token = localStorage.getItem('token');

    collaborationSocketRef.current = io(config.ROOT_BASE_API, {
      path: '/api/collab/socket.io',
      auth: { token: `Bearer ${token}` },
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

    collaborationSocketRef.current.on('load-code', (newCode) => setCode(newCode));

    collaborationSocketRef.current.on('code-updated', (newCode) => {
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
    if (!isRemoteUpdateRef.current) {
      collaborationSocketRef.current?.emit('edit-code', code);
    }
    isRemoteUpdateRef.current = false;
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

  const handleCloseModal = () => {
    closeModal();
    navigate('/dashboard'); // Redirect to dashboard when modal is closed
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000
      }}>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Group h="100vh" bg="slate.8" gap="10px" p="10px">
        <Stack h="100%" w="500px" gap="10px">
          <Group gap="10px">
            <VideoCall
              communicationSocket={communicationSocketRef.current}
              roomId={sessionData?.sessionId}
            />
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

      <Modal
        opened={modalOpened}
        onClose={handleCloseModal} // Close modal and navigate on close
        title="Permissions Required"
      >
        <Text size="lg">
          Camera and microphone permissions are required to access this room. Please refresh the page and grant access.
        </Text>
        <Button onClick={() => window.location.reload()} style={{ marginTop: '20px' }}>
          Refresh
        </Button>
      </Modal>
    </>
  );
}

export default Room;
