import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import DeleteQuestionDialog from "./DeleteQuestionDialog";
import { Question } from "@/models/Question";
import { fetchAdminStatus } from "@/services/UserFunctions";


interface DeleteQuestionButtonProps {
  question: Question;
  onDelete: () => void;
  // isAdmin: Boolean;
}

const DeleteQuestionButton: React.FC<DeleteQuestionButtonProps> = ({
  question,
  onDelete,
}) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<Boolean>(false);

async function fetchStatus(): Promise<Boolean> {

  const res = await fetchAdminStatus();
  if (!res.success) {
    console.error("Error fetching data", res.error);
    return false;
  }

  const isAdmin: boolean = res.data.isAdmin;
  return isAdmin;
};


useEffect(() => {
    
  async function updateStatus() {
    const result = await fetchStatus();
    setIsAdmin(result)
  }
  updateStatus();
  
}, []);
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
        <X size={20} />
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
