import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";

import NavLink from "@/components/navLink";
import CategoryTags from "@/components/questions/CategoryTags";
import DifficultyTags from "@/components/questions/DifficultyTags";
import { Question } from "@/types/questions";

interface QuestionDescriptionProps {
  question: Question;
  isCollab: boolean;
}

export default function QuestionDescription({
  question,
  isCollab,
}: QuestionDescriptionProps) {
  const {
    questionId,
    title,
    complexity,
    category,
    description,
    examples,
    constraints,
  } = question;

  return (
    <Card className="p-5 m-8">
      <CardHeader className="flex flex-col items-start">
        <h2 className="font-bold text-2xl mb-4">{`${title}`}</h2>
        <div className="flex mb-4 text-med">
          Complexity:&nbsp; <DifficultyTags difficulty={complexity} />
        </div>
        <div className="mb-4 text-sm">
          <CategoryTags
            categories={category}
            questionId={questionId as string}
          />
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p className="my-3 text-lg">Description</p>
        <div className="max-h-[150px] overflow-y-auto">
          <pre className="bg-gray-700 p-2 rounded-lg text-balance">
            <code className="text-white text-pretty">{description}</code>
          </pre>
        </div>
        <p className="my-3 text-lg">Examples</p>
        <div className="max-h-[150px] overflow-y-auto">
          <pre className="bg-gray-700 p-2 rounded-lg text-balance">
            <code className="text-white text-pretty">{examples}</code>
          </pre>
        </div>
        <p className="my-3 text-lg">Constraints</p>
        <div className="max-h-[150px] overflow-y-auto">
          <pre className="bg-gray-700 p-2 rounded-lg text-balance">
            <code className="text-white text-pretty">{constraints}</code>
          </pre>
        </div>
      </CardBody>
      {!isCollab && (
        <CardFooter>
          <NavLink hover={true} href="/questions">
            Back to questions
          </NavLink>
        </CardFooter>
      )}
    </Card>
  );
}

