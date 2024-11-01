import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { QuestionHistory } from "@/models/QuestionHistory";
import QuestionHistoryCard from "./QuestionHistoryCard";

type QuestionHistoryProps = {
  questionHistory: QuestionHistory;
};

const QuestionHistoryDialog: React.FC<QuestionHistoryProps> = ({
  questionHistory,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="line-clamp-1" variant="link">
          {questionHistory.title}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex justify-center max-w-[80%] max-h-[80%] overflow-y-auto">
        <QuestionHistoryCard
          variant="ghost"
          questionHistory={questionHistory}
        />
      </DialogContent>
    </Dialog>
  );
};

export default QuestionHistoryDialog;
