import { useQuestions } from "@/hooks/useQuestions";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Question {
  id: number;
  title: string;
  description: string;
  categories: string[];
  complexity: "Easy" | "Medium" | "Hard";
}

// Sample static data
// TODO: Replace with actual data from the backend
const questions: Question[] = [
  {
    id: 1,
    title: "Question 1",
    description: "Description 1",
    categories: ["Category 1", "Category 2"],
    complexity: "Easy",
  },
  {
    id: 2,
    title: "Question 2",
    description: "Description 2",
    categories: ["Category 1", "Category 2"],
    complexity: "Medium",
  },
  {
    id: 3,
    title: "Question 3",
    description: "Description 3",
    categories: ["Category 1", "Category 2"],
    complexity: "Hard",
  },
];

export default function ProblemsRoute() {
  // const { data, isLoading } = useQuestions();

  // if (isLoading || !data) {
  //   return (
  //     <div className='flex flex-col items-center justify-center h-full'>
  //       <Loader2 className='w-8 h-8 animate-spin' />
  //       <p className="mt-2">Loading...</p>
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Problems</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {questions.map((question) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle>{question.title}</CardTitle>
              <CardDescription>
                {question.categories.map((category, index) => (
                  <Badge key={index} variant="outline" className="mr-2">
                    {category}
                  </Badge>
                ))}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{question.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Badge
                variant="outline"
                className={`${getComplexityColor(
                  question.complexity
                )} font-semibold`}
              >
                {question.complexity}
              </Badge>
              <Button asChild>
                <Link to={`/problems/${question.id}`}>Solve Problem</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

const getComplexityColor = (complexity: "Easy" | "Medium" | "Hard") => {
  switch (complexity) {
    case "Easy":
      return "bg-green-200 text-green-800";
    case "Medium":
      return "bg-yellow-200 text-yellow-800";
    case "Hard":
      return "bg-red-200 text-red-800";
  }
};
