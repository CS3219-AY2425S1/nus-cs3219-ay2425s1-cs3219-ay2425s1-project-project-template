import { Button, Progress, Spacer } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";

interface MatchmakingInProgressProps {
  onStop: () => void;
  onClose: () => void;
  isOpen: boolean;
  matchmakingTime: number;
}

const MatchmakingInProgress: React.FC<MatchmakingInProgressProps> = ({
  onStop,
  onClose,
  isOpen,
  matchmakingTime,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <h3>Matchmaking in progress...</h3>
        </ModalHeader>
        <ModalBody>
          <p>Hold on as we find someone for you...</p>
          <Spacer y={1} />
          <Progress color="primary" value={matchmakingTime} />
          <p>Matchmaking time: {matchmakingTime}s</p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={onStop}>
            Stop
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MatchmakingInProgress;
