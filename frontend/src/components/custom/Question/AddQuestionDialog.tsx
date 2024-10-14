import { Dialog, DialogContent } from "@/components/ui/dialog";
import AddQuestionCard from "./AddQuestionCard";

interface AddQuestionCardProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddQuestionDialog: React.FC<AddQuestionCardProps> = ({
  open,
  setOpen,
}) => {
  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex justify-center">
        <AddQuestionCard onSubmit={handleCloseDialog} />
      </DialogContent>
    </Dialog>
  );
};

export default AddQuestionDialog;
