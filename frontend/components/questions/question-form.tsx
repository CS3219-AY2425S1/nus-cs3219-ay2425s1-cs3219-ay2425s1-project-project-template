"use client";

import { Question } from "@/lib/schemas/question-schema";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AutosizeTextarea } from "../ui/autosize-textarea";

interface QuestionFormProps {
  data: Question | undefined;
  isAdmin: boolean | undefined;
  handleSubmit?: (question: Question) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ ...props }) => {
  const [question, setQuestion] = useState<Question>();

  useEffect(() => {
    setQuestion(props.data);
  }, [props.data]);

  return (
    <form>
      <Card>
        <CardHeader>
          <CardTitle className="m-4">
            <Label>Title</Label>
            <Input
              value={question?.title}
              className="mt-2"
              onChange={(e) =>
                question && setQuestion({ ...question, title: e.target.value })
              }
              disabled={!props.isAdmin}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="m-4">
            <Label>Category</Label>
            <Input
              value={question?.category}
              className="mt-2"
              onChange={(e) =>
                question &&
                setQuestion({ ...question, category: e.target.value })
              }
              disabled={!props.isAdmin}
            />
          </div>
          <div className="m-4">
            <Label>Complexity</Label>
            <div className="mt-2">
              {props.isAdmin ? (
                <Select
                  value={question?.complexity}
                  onValueChange={(e) =>
                    question && setQuestion({ ...question, complexity: e })
                  }
                  disabled={!props.isAdmin}
                >
                  <SelectTrigger id="complexity">
                    <SelectValue placeholder="Select complexity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={question?.complexity}
                  onChange={(e) =>
                    question &&
                    setQuestion({ ...question, complexity: e.target.value })
                  }
                  disabled={!props.isAdmin}
                />
              )}
            </div>
          </div>
          <div className="m-4">
            <Label>Description</Label>
            <AutosizeTextarea
              value={question?.description}
              className="mt-2"
              minHeight={200}
              onChange={(e) =>
                question &&
                setQuestion({ ...question, description: e.target.value })
              }
              disabled={!props.isAdmin}
            />
          </div>
        </CardContent>
        <CardFooter>
          {props.isAdmin && (
            <Button
              onClick={() =>
                question && props.handleSubmit && props.handleSubmit(question)
              }
            >
              Save Changes
            </Button>
          )}
        </CardFooter>
      </Card>
    </form>
  );
};

export default QuestionForm;
