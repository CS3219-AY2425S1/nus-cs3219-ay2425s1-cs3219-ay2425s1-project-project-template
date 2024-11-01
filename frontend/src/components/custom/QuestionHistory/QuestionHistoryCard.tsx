import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { QuestionExample, Topic } from "@/models/Question";
import { QuestionHistory } from "@/models/QuestionHistory";
import React from "react";

// Define the prop types for the component
type QuestionHistoryProps = {
  questionHistory: QuestionHistory;
  variant?: "default" | "ghost";
};

// Functional component that takes a custom question prop
const QuestionHistoryCard: React.FC<QuestionHistoryProps> = ({
  questionHistory,
  variant = "default",
}) => {
  const visibleTopics: Topic[] = questionHistory.topics.slice(0, 3);
  const moreTopicsCount: number =
    questionHistory.topics.length - visibleTopics.length;

  return (
    <Card variant={variant} className="w-full h-full">
      <CardHeader>
        <CardTitle className="break-words">{questionHistory.title}</CardTitle>
        <div className="inline-flex gap-1">
          <Badge
            className={`inline-flex items-center justify-center rounded-full text-xs font-medium`}
          >
            {questionHistory.difficulty}
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
        <div>{questionHistory.description}</div>
        {(questionHistory.examples.length > 0 ||
          questionHistory.constraints.length > 0) && (
          <Separator className="my-2" />
        )}
        {questionHistory.examples.length > 0 &&
          questionHistory.examples.map(
            (example: QuestionExample, index: number) => (
              <div>
                <strong>Example {index + 1}:</strong>
                <br />
                <strong>Input:</strong> {example.input}
                <br />
                <strong>Output:</strong> {example.output}
                <Separator className="my-2" />
              </div>
            )
          )}
        {questionHistory.constraints.length > 0 && (
          <div>
            <strong>Constraints:</strong>
            <ul>
              {questionHistory.constraints.map((constraint: string) => (
                <li key={constraint}>{constraint}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionHistoryCard;
