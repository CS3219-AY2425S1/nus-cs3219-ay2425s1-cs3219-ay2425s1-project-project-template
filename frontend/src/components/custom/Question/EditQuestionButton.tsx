import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useState, useEffect } from "react";
import EditQuestionDialog from "./EditQuestionDialog";
import { fetchAdminStatus } from "@/services/UserFunctions";
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
