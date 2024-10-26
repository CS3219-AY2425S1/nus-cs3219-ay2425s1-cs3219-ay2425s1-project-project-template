
import { FC } from 'react';
import CollaborationInterface from './collaborationInterface';
import { useLocation } from 'react-router-dom';
import { useCollaboration } from '../../hooks/CollaborationHooks';

const CollaborationPage: FC = () => {
  const location = useLocation();

  const {
    isConnected,
    sendCode,
    sendMessage,
    changeLanguage,
    ...collaborationState
  } = useCollaboration({
    roomId: '123456',
    userId: 'user-123',
    onConnectionError: (error) => console.error(error)
  });

  return (
    <CollaborationInterface
      roomId="123456"
      onLeaveRoom={() => {/* handle room exit */}}
      onLanguageChange={changeLanguage}
      onCodeChange={sendCode}
      onMessageSend={sendMessage}
    />
  );
};

export default CollaborationPage;