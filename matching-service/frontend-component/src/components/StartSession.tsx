import React, { useState, useMemo } from "react";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";

interface StartSessionProps {
  onContinue: (difficulty: string, topic: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

// Maybe pass these in as props? Need to be dynamically retrieved from question-service
const difficulties = ["Easy", "Medium", "Hard"];
const topics = ["Dynamic Programming", "Graphs", "Arrays"];

const StartSession: React.FC<StartSessionProps> = ({
  onContinue,
  onClose,
  isOpen,
}) => {
  const [selectedDifficultyKeys, setSelectedDifficultyKeys] = useState(
    new Set(["Easy"])
  );
  const [selectedTopicKeys, setSelectedTopicKeys] = useState(
    new Set(["Dynamic Programming"])
  );

  const selectedDifficulty = useMemo(
    () => Array.from(selectedDifficultyKeys).join(", "),
    [selectedDifficultyKeys]
  );

  const selectedTopic = useMemo(
    () => Array.from(selectedTopicKeys).join(", "),
    [selectedTopicKeys]
  );

  const handleDifficultyChange = (keys: any) => {
    setSelectedDifficultyKeys(new Set(keys));
  };

  const handleTopicChange = (keys: any) => {
    setSelectedTopicKeys(new Set(keys));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col">
          <h3>Start a new session</h3>
          <p>
            Choose the topic, difficulty and we will match you with someone
            else!
          </p>
        </ModalHeader>
        <ModalBody>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered">{selectedDifficulty}</Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Select Difficulty"
              variant="flat"
              closeOnSelect={true}
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={selectedDifficultyKeys}
              onSelectionChange={handleDifficultyChange}
            >
              {difficulties.map((diff) => (
                <DropdownItem key={diff}>{diff}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered">{selectedTopic}</Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Select Topic"
              variant="flat"
              closeOnSelect={true}
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={selectedTopicKeys}
              onSelectionChange={handleTopicChange}
            >
              {topics.map((top) => (
                <DropdownItem key={top}>{top}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => onContinue(selectedDifficulty, selectedTopic)}>
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StartSession;
