import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddQuestionDialog from "./AddQuestionDialog";

interface AddQuestionButtonProps {
  onCreate: () => void;
}

const AddQuestionButton: React.FC<AddQuestionButtonProps> = ({ onCreate }) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  return (
    <>
      <Button
        onClick={handleOpenDialog}
        className="bg-green-400 hover:bg-green-500"
      >
        <Plus />
      </Button>
      <AddQuestionDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onCreate={onCreate}
      />
    </>
  );
};

export default AddQuestionButton;
