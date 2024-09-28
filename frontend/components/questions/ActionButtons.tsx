import { Button } from "@nextui-org/button";
import { useRouter } from "next/router";
import { useState } from "react";

import { PencilIcon, TrashIcon } from "../icons";

import { useDeleteQuestions } from "@/hooks/questions";
import { Question } from "@/types/questions";

interface ActionButtonsProps {
  question: Question;
}

export default function ActionButtons({ question }: ActionButtonsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const { mutate: deleteQuestion } = useDeleteQuestions();

  const handleEditOnClick = () => {
    // Redirect to the edit page with only questionId
    router.push({
      pathname: `/questions/edit/${question.questionId}`,
    });
  };

  const handleDeleteOnClick = () => {
    setIsDeleting(true);

    if (!question.questionId) {
      console.error("Question ID is undefined, cannot delete question.");

      return;
    }
    setIsDeleting(true);

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
      <Button isIconOnly onClick={handleEditOnClick}>
        <PencilIcon />
      </Button>
      <Button isIconOnly disabled={isDeleting} onClick={handleDeleteOnClick}>
        <TrashIcon />
      </Button>
    </div>
  );
}
