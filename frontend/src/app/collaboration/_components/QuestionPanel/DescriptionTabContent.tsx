import { getQuestions } from "@/services/questionService";
import { QuestionsSchema } from "@/types/Question";

export default async function DescriptionTabContent() {
  const questionsResponse = await getQuestions();

  if (questionsResponse.statusCode !== 200) {
    return <div>You are not authenticated</div>;
  }

  // TODO: Based on the session, get the actual question
  const questions = QuestionsSchema.parse(questionsResponse.data.questions);

  const question = questions[0];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{question.title}</h2>
      <p>{question.description}</p>
    </div>
  );
}
