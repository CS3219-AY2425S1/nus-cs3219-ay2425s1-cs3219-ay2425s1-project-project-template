import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import DeleteQuestionDialog from "./DeleteQuestionDialog";
import { Question } from "@/models/Question";


interface DeleteQuestionButtonProps {
  question: Question;
  onDelete: () => void;
  isAdmin: Boolean;
}

const DeleteQuestionButton: React.FC<DeleteQuestionButtonProps> = ({
  question,
  onDelete,
  isAdmin,
}) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  if (!isAdmin) {
    return null; // Return null to render nothing
  }


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
        <X size={30} />
      </Button>
      <DeleteQuestionDialog
        open={openDialog}
        setOpen={setOpenDialog}
        question={question}
        onDelete={onDelete}
      />
    </>
  );
};

export default DeleteQuestionButton;
