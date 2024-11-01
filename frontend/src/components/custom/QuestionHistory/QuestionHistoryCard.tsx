import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { QuestionHistory } from "@/models/QuestionHistory";
import React from "react";
import QuestionCard from "../Question/QuestionCard";
import { Editor } from "@monaco-editor/react";

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
  const { dateAttempted, codeWritten, ...question } = questionHistory;

  return (
    <Card variant={variant} className="w-full h-full grid grid-cols-2">
      <div className="flex items-center justify-center col-span-2 md:col-span-1">
        <QuestionCard question={question} variant="ghost" />
      </div>

      <Separator
        className="block md:hidden mx-2 col-span-2"
        orientation="horizontal"
      />

      <div className="flex items-stretch justify-between col-span-2 md:col-span-1">
        <Separator className="hidden md:block mx-2" orientation="vertical" />

        <div className="flex flex-col h-full w-full">
          <h3 className="text-muted-foreground mb-2">Your Attempt</h3>
          <Editor height="100%" value={codeWritten} options={{ readOnly: true }} />
        </div>
      </div>
    </Card>
  );
};

export default QuestionHistoryCard;
