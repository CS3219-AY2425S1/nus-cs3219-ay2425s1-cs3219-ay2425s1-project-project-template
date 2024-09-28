import { Question } from "@/types/questions";
import type { PressEvent } from "@react-types/shared";
import { Button } from "@nextui-org/button";
import { useDeleteQuestions } from "@/hooks/questions";
import { useRouter } from "next/router";
import { useState } from "react";

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
      <Button onClick={handleEditOnClick} color="warning">
        <p>Edit</p>
      </Button>
      <Button
        onClick={handleDeleteOnClick}
        color="danger"
        disabled={isDeleting}
      >
        <p>{isDeleting ? "Deleting..." : "Delete"}</p>
      </Button>
    </div>
  );
}
