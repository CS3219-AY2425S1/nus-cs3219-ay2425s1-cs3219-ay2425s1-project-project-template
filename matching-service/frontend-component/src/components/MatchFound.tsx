import { Button, Spacer, Badge } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";

interface MatchFoundProps {
  onConfirm: () => void;
  onClose: () => void;
  isOpen: boolean;
}

const MatchFound: React.FC<MatchFoundProps> = ({
  onConfirm,
  onClose,
  isOpen,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <h3>We found a match! Hang tight!</h3>
        </ModalHeader>
        <ModalBody>
          <Badge variant="flat" color="success">
            <p>Setting up your coding environment...</p>
          </Badge>
          <Spacer y={1} />
          <p>You will be redirected automatically.</p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={() => console.log("Canceled")}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MatchFound;
