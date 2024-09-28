"use client";

import QuestionTable from "@/components/questions/QuestionTable";
import DefaultLayout from "@/layouts/default";
import { Question } from "@/types/questions";
import { useQuestions } from "@/hooks/questions";

const QuestionsPage = () => {
  const { data: questions, isLoading, error } = useQuestions();

  return (
    <DefaultLayout>
      <div className="flex items-center justify-center">
        <QuestionTable questions={questions || []} />
      </div>
    </DefaultLayout>
  );
};

export default QuestionsPage;
