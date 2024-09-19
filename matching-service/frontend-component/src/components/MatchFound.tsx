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
        <ModalHeader className="font-sans flex flex-col pt-8">
          <p className="text-xl font-bold pb-2">
            We found a match! Hang tight!
          </p>
        </ModalHeader>
        <ModalBody>
          <Badge variant="flat" color="success">
            <p>
              Setting up your coding environment...
              <br />
              You will be redirected automatically.
            </p>
          </Badge>
          <Spacer y={1} />
          <p></p>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MatchFound;
