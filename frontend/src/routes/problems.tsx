import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuestions } from "@/hooks/useQuestions";
import { Question } from "@/types/question";

export default function ProblemsRoute() {
  const { data: questions, isLoading } = useQuestions();

  console.log(questions);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="mt-2">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Problem Set</h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="max-h-[70vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">Title</TableHead>
                <TableHead className="w-[30%]">Categories</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead className="w-[40%]">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions &&
                questions.map((question: Question) => (
                  <TableRow key={question.id}>
                    <TableCell className="font-medium">
                      <Link
                        to={`/problems/${question.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {question.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {question.categories.map((category, index) => (
                        <Badge key={index} variant="outline" className="mr-1">
                          {category}
                        </Badge>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="font-medium"
                        difficulty={
                          question.difficulty.toLowerCase() as
                            | "easy"
                            | "medium"
                            | "hard"
                        }
                      >
                        {question.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>{`${question.description.substring(
                      0,
                      100
                    )}...`}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
