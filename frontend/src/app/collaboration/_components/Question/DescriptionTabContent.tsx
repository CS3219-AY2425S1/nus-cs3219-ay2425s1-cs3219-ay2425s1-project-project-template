"use client";

import { getQuestions } from "@/services/questionService";
import { QuestionsSchema } from "@/types/Question";

export default async function DescriptionTabContent() {
  const questionsResponse = await getQuestions();

  if (questionsResponse.statusCode !== 200) {
    return <div>You are not authenticated</div>;
  }

  const questions = QuestionsSchema.parse(questionsResponse.data.questions);
  const question = questions[0];

  return (
    <div className="flex flex-col p-4 h-full">
      <div
        className="flex flex-col overflow-y-auto"
        style={{
          maxHeight: 'calc(100vh - 150px)',
        }}
      >
        <h2 className="mb-4 text-2xl font-bold">{question.title}</h2>
        <div
          className="description-content"
          dangerouslySetInnerHTML={{ __html: question.description }}
        />
      </div>
    </div>
  );
}
