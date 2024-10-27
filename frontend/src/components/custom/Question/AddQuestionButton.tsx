import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddQuestionDialog from "./AddQuestionDialog";

interface AddQuestionButtonProps {
  onCreate: () => void;
  isAdmin: Boolean;
}

const AddQuestionButton: React.FC<AddQuestionButtonProps> = ({ onCreate, isAdmin }) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

    // Don't render anything if not an admin
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
