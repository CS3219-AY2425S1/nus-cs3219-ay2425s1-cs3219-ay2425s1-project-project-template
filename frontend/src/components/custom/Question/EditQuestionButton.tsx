import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import EditQuestionDialog from "./EditQuestionDialog";
import { Question } from "@/models/Question";

interface EditQuestionButtonProps {
  onEdit: () => void;
  question: Question;
}

const EditQuestionButton: React.FC<EditQuestionButtonProps> = ({
  onEdit,
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
        className="bg-green-400 hover:bg-green-500"
        size="sm"
      >
        <RefreshCcw />
      </Button>
      <EditQuestionDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onEdit={onEdit}
        question={question}
      />
    </>
  );
};

export default EditQuestionButton;
