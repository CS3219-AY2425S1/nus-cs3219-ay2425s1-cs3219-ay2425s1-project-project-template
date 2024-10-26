
import { FC } from 'react';
import CollaborationInterface from './collaborationInterface';
import { useLocation } from 'react-router-dom';
import { useCollaboration } from '../../hooks/CollaborationHooks';

const CollaborationPage: FC = () => {
  const location = useLocation();
  const { roomId, userId, question } = location.state;

  const {
    isConnected,
    sendCode,
    sendMessage,
    changeLanguage,
    ...collaborationState
  } = useCollaboration({
    roomId,
    userId,
    onConnectionError: (error) => console.error(error)
  });

  return (
    <CollaborationInterface
      roomId={roomId}
      question={question}
      onLeaveRoom={() => {/* handle room exit */}}
      onLanguageChange={changeLanguage}
      onCodeChange={sendCode}
      onMessageSend={sendMessage}
    />
  );
};

export default CollaborationPage;