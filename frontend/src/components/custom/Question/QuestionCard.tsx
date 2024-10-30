import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Question, QuestionExample, Topic } from "@/models/Question";
import React from "react";

// Define the prop types for the component
type QuestionProps = {
  question: Question;
  variant?: "default" | "ghost";
};

// Functional component that takes a custom question prop
const QuestionCard: React.FC<QuestionProps> = ({
  question,
  variant = "default",
}) => {
  const visibleTopics: Topic[] = question.topics.slice(0, 3);
  const moreTopicsCount: number = question.topics.length - visibleTopics.length;

  return (
    <Card variant={variant} className="w-full h-full">
      <CardHeader>
        <CardTitle className="break-words">{question.title}</CardTitle>
        <div className="inline-flex gap-1">
          <Badge
            className={`inline-flex items-center justify-center rounded-full text-xs font-medium`}
          >
            {question.difficulty}
          </Badge>
          {visibleTopics.map((topic: Topic) => (
            <Badge
              className={`inline-flex items-center justify-center rounded-full text-xs font-medium whitespace-nowrap`}
              variant="outline"
            >
              {topic}
            </Badge>
          ))}
          {moreTopicsCount > 0 && (
            <Badge
              className="inline-flex items-center justify-center rounded-full text-xs font-medium"
              variant="secondary"
            >
              +{moreTopicsCount} more
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="break-words">
        <div>{question.description}</div>
        {(question.examples.length > 0 || question.constraints.length > 0) && (
          <Separator className="my-2" />
        )}
        {question.examples.length > 0 &&
          question.examples.map((example: QuestionExample, index: number) => (
            <div>
              <strong>Example {index + 1}:</strong>
              <br />
              <strong>Input:</strong> {example.input}
              <br />
              <strong>Output:</strong> {example.output}
              <Separator className="my-2" />
            </div>
          ))}
        {question.constraints.length > 0 && (
          <div>
            <strong>Constraints:</strong>
            <ul>
              {question.constraints.map((constraint: string) => (
                <li key={constraint}>{constraint}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
