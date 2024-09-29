import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useState } from "react";

import { PencilIcon, TrashIcon } from "@/components/icons";
import { useDeleteQuestions } from "@/hooks/questions";
import { Question } from "@/types/questions";

interface ActionButtonsProps {
  question: Question;
}

export default function ActionButtons({ question }: ActionButtonsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { mutate: deleteQuestion } = useDeleteQuestions();

  const handleEditOnClick = () => {
    // Redirect to the edit page with only questionId
    router.push({
      pathname: `/questions/edit/${question.questionId}`,
    });
  };

  const confirmDelete = () => {
    setIsDeleting(true);

    if (!question.questionId) {
      console.error("Question ID is undefined, cannot delete question.");
      setIsDeleting(false);

      return;
    }

    deleteQuestion(question.questionId, {
      onSuccess: () => {
        setIsDeleting(false);
        console.log("Question deleted:", question.questionId);
      },
      onError: (error) => {
        setIsDeleting(false);
        console.error("Error deleting the question:", error);
      },
    });
  };

  return (
    <div className="flex gap-2 justify-center">
      {/* Edit Button */}
      <Button isIconOnly onPress={handleEditOnClick}>
        <PencilIcon />
      </Button>

      {/* Delete Button */}
      <Button isIconOnly disabled={isDeleting} onPress={onOpen}>
        <TrashIcon />
      </Button>

      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Deletion
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete this question? This action
                  cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={confirmDelete}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
