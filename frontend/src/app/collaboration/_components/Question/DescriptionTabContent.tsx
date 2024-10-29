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

  // const sessionQuestionResponse = await getQuestionBySlug(
  //   sessionInfoResponse.data.questionId
  // );

  // if (
  //   sessionQuestionResponse.statusCode !== 200 ||
  //   !sessionQuestionResponse.data
  // ) {
  //   redirect("/dashboard");
  //   return <div>Question not found: {sessionInfoResponse.data.questionId}</div>;
  // }

  return (
    <div className="flex flex-col p-4 overflow-scroll min-w-96">
      <h2 className="mb-4 text-2xl font-bold">{question.title}</h2>
      <p>{question.description}</p>
    </div>
  );
}
