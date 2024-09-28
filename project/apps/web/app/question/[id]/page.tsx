import { notFound } from "next/navigation";
import { fetchQuestionById } from "@/lib/api/question";
import { QuestionDto } from "@repo/dtos/questions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import DifficultyBadge from "@/components/DifficultyBadge";
import { Badge } from "@/components/ui/badge";

interface QuestionPageProps {
  params: {
    id: string;
  };
}

const QuestionPage = async ({ params }: QuestionPageProps) => {
  const { id } = params;

  let question: QuestionDto | null = null;
  try {
    question = await fetchQuestionById(id);
  } catch (error) {
    console.error("Error fetching question:", error);
  }

  if (!question) {
    return notFound();
  }

  return (
    <div className="container mx-auto p-4">
      {/* Back Button */}
      <div className="flex items-center my-4">
        <Link href="/questions">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Questions
          </Button>
        </Link>
      </div>

      {/* Question Details */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center mb-4 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            {question.q_title}
          </h1>
          <DifficultyBadge complexity={question.q_complexity} />
        </div>
        <p className="text-gray-600 mb-6">{question.q_desc}</p>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="font-bold text-gray-700">Categories </div>
            <div className="flex gap-2">
              {question.q_category.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
