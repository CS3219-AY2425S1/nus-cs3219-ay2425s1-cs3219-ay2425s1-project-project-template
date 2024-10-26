import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import DataTable from "../Question/data-table"; // Make sure to import the updated DataTable component
import { Question } from "../Question/question";

interface QuestionSelectModalProps {
  open: boolean;
  onClose: () => void;
  onQuestionSelect: (question: Question) => void;
}

const QuestionSelectModal: React.FC<QuestionSelectModalProps> = ({
  open,
  onClose,
  onQuestionSelect,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Select a Question</DialogTitle>
      <DialogContent>Add table here</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionSelectModal;
