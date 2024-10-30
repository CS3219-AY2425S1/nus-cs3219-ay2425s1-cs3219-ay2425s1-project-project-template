import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Question } from "@/models/Question";
import QuestionCard from "./QuestionCard";

type QuestionProps = {
  question: Question;
};

const QuestionDialog: React.FC<QuestionProps> = ({ question }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="line-clamp-1" variant="link">
          {question.title}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex justify-center max-w-[80%] max-h-[80%] overflow-y-auto">
        <QuestionCard variant="ghost" question={question} />
      </DialogContent>
    </Dialog>
  );
};

export default QuestionDialog;
