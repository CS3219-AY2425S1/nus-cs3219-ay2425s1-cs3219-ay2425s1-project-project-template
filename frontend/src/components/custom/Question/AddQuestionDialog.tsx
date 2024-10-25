import { Dialog, DialogContent } from "@/components/ui/dialog";
import AddQuestionCard from "./AddQuestionCard";

interface AddQuestionDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onCreate: () => void;
}

const AddQuestionDialog: React.FC<AddQuestionDialogProps> = ({
  open,
  setOpen,
  onCreate,
}) => {
  const handleCloseDialog = () => {
    setOpen(false);
    onCreate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex justify-center">
        <AddQuestionCard onCreate={handleCloseDialog} />
      </DialogContent>
    </Dialog>
  );
};

export default AddQuestionDialog;
