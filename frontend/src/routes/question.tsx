import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuestion } from "@/hooks/useQuestion";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";

export default function QuestionRoute() {
  const { questionId } = useParams<{ questionId: string }>();
  const { data: question, isLoading } = useQuestion(Number(questionId));

  if (isLoading || !question) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="mt-2">Loading...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{question.title}</CardTitle>
        <div>
          <Badge
            difficulty={
              question.difficulty.toLowerCase() as "easy" | "medium" | "hard"
            }
          >
            {question.difficulty}
          </Badge>
          {question.categories.map((category, index) => (
            <Badge key={index} variant="outline" className="ml-2">
              {category}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p>{question.description}</p>

        <h3 className="text-lg font-semibold mt-4 mb-2">Examples</h3>
        {question.examples.map((example, index) => (
          <div key={index} className="mb-2">
            <p>
              <strong>Input:</strong> {example.input}
            </p>
            <p>
              <strong>Output:</strong> {example.output}
            </p>
          </div>
        ))}

        <h3 className="text-lg font-semibold mt-4 mb-2">Constraints</h3>
        <ul className="list-disc pl-5">
          {question.constraints.map((constraint, index) => (
            <li key={index}>{constraint}</li>
          ))}
        </ul>

        <a
          href={question.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          View on LeetCode
        </a>
      </CardContent>
    </Card>
  );
}
