"use client";

import QuestionTable from "@/components/questions/QuestionTable";
import DefaultLayout from "@/layouts/default";
import { useQuestions } from "@/hooks/questions";

const QuestionsPage = () => {
  const { data: questions, isLoading, error } = useQuestions();

  return (
    <DefaultLayout>
      <div className="flex items-center justify-center">
        {isLoading ? (
          <p>Loading questions...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          <QuestionTable questions={questions?.questions || []} />
        )}
      </div>
    </DefaultLayout>
  );
};

export default QuestionsPage;
