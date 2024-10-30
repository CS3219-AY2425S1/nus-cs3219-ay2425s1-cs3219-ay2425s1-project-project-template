import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { SingleSelect } from "@/components/ui/single-select";
import { Textarea } from "@/components/ui/textarea";
import { HTTP_SERVICE_QUESTION, SuccessObject, callFunction } from "@/lib/utils";
import {
  Difficulty,
  Question,
  QuestionExample,
  Topic,
  difficultyArray,
  topicArray,
} from "@/models/Question";
import { Loader2 } from "lucide-react";
import { ChangeEventHandler, FormEvent, useState } from "react";

interface QuestionData {
  title: string;
  description: string;
  difficulty: Difficulty[];
  topics: Topic[];
  examples: QuestionExample[];
  constraints: string[];
}

interface AddQuestionCardProps {
  onCreate: () => void;
}

const AddQuestionCard: React.FC<AddQuestionCardProps> = ({ onCreate }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [questionData, setQuestionData] = useState<QuestionData>({
    title: "",
    description: "",
    difficulty: [],
    topics: [],
    examples: [],
    constraints: [],
  });

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const target = event.target as HTMLInputElement;
    setQuestionData({
      ...questionData,
      [target.name]: target.value,
    });
  };

  const handleDifficultyChange = (value: string[]) => {
    setQuestionData({
      ...questionData,
      difficulty: value as Difficulty[],
    });
  };

  const handleTopicChange = (value: string[]) => {
    setQuestionData({
      ...questionData,
      topics: value as Topic[],
    });
  };

  const handleAddQuestion = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const question: Partial<Question> = {
      title: questionData.title,
      description: questionData.description,
      topics: questionData.topics,
      difficulty: questionData.difficulty[0],
      examples: [],
      constraints: [],
    };

    const result: SuccessObject = await callFunction(
      HTTP_SERVICE_QUESTION,
      "create-question",
      "POST",
      question
    );

    if (!result.success) {
      alert(result.error);
    }

    setIsLoading(false);
    onCreate();
  };

  return (
    <Card variant="ghost" className="w-full h-full">
      <CardHeader>
        <CardTitle>Add New Question</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddQuestion}>
          <div className="grid w-full gap-1.5 my-4">
            <Label>Question Title</Label>
            <Input
              name="title"
              type="text"
              placeholder="Type your question title here."
              required
              onChange={handleInputChange}
            />
          </div>

          <div className="grid w-full gap-1.5 my-4">
            <Label>Question Description</Label>
            <Textarea
              name="description"
              placeholder="Type your question description here."
              className="resize-none"
              required
              onChange={
                handleInputChange as unknown as ChangeEventHandler<HTMLTextAreaElement> // Bad practice but necessary for now
              }
            />
          </div>

          <div className="grid w-full gap-1.5 my-4">
            <Label>Question Difficulty</Label>
            <SingleSelect
              className="grid-rows-1 my-2"
              options={difficultyArray}
              defaultValue={questionData.difficulty}
              onValueChange={(difficulty: string[]) =>
                handleDifficultyChange(difficulty)
              }
              placeholder="Select Question Difficulty"
            />
          </div>

          <div className="grid w-full gap-1.5 my-4">
            <Label>Question Topics</Label>
            <MultiSelect
              className="grid-rows-1 my-2 w-full"
              options={topicArray}
              defaultValue={questionData.topics}
              onValueChange={(topics: string[]) => handleTopicChange(topics)}
              placeholder="Select Question Topics"
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : ""}
            Add Question
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddQuestionCard;
