import { Dialog, DialogContent } from "@/components/ui/dialog";
import EditQuestionCard from "./EditQuestionCard";
import { Question } from "@/models/Question";

interface EditQuestionDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onEdit: () => void;
  question: Question;
}

const EditQuestionDialog: React.FC<EditQuestionDialogProps> = ({
  open,
  setOpen,
  onEdit,
  question,
}) => {
  const handleCloseDialog = () => {
    setOpen(false);
    onEdit();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex justify-center">
        <EditQuestionCard onEdit={handleCloseDialog} question={question} />
      </DialogContent>
    </Dialog>
  );
};

export default EditQuestionDialog;
