import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import DeleteQuestionDialog from "./DeleteQuestionDialog";
import { Question } from "@/models/Question";

interface DeleteQuestionButtonProps {
  question: Question;
}

const DeleteQuestionButton: React.FC<DeleteQuestionButtonProps> = ({
  question,
}) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  return (
    <>
      <Button
        onClick={handleOpenDialog}
        className="bg-red-400 hover:bg-red-500"
        size="sm"
      >
        <X size={20} />
      </Button>
      <DeleteQuestionDialog
        open={openDialog}
        setOpen={setOpenDialog}
        question={question}
      />
    </>
  );
};

export default DeleteQuestionButton;
