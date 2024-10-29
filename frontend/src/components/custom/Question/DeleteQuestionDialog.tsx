import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { HTTP_SERVICE_QUESTION, SuccessObject, callFunction } from "@/lib/utils";
import { Question } from "@/models/Question";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface DeleteQuestionCardProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  question: Question;
  onDelete: () => void;
}

const DeleteQuestionDialog: React.FC<DeleteQuestionCardProps> = ({
  open,
  setOpen,
  question,
  onDelete,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    const result: SuccessObject = await callFunction(
      HTTP_SERVICE_QUESTION,
      "delete-question",
      "DELETE",
      { id: question.id }
    );

    if (!result.success) {
      alert(result.error);
    }

    setIsLoading(false);
    handleCloseDialog();
    onDelete();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="justify-center">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold leading-none tracking-tight">
            Delete Question: {question.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Deletion is non-reversable, please double check before deleting.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center">
          <p>Are you sure you want to delete this question?</p>
          <b className="text-xl my-2 text-orange-500">{question.title}</b>
        </div>
        <DialogFooter>
          <Button
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-500"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : ""}
            Delete
          </Button>
          <Button onClick={handleCloseDialog} className="bg-slate-400">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteQuestionDialog;
