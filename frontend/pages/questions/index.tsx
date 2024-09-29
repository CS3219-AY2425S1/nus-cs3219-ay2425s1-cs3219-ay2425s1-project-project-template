"use client";
import { useState } from "react";
import { Pagination } from "@nextui-org/pagination";

import { useQuestions } from "@/hooks/questions";
import QuestionTable from "@/components/questions/QuestionTable";
import DefaultLayout from "@/layouts/default";

const QuestionsPage = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const { data: questionList, isLoading, isError } = useQuestions(pageNumber);
  const handleOnPageClick = (page: number) => {
    setPageNumber(page);
  };

  return (
    <>
      <DefaultLayout>
        {isLoading ? (
          <p>Fetching Questions...</p>
        ) : isError ? (
          <p>Had Trouble Fetching Questions!</p>
        ) : (
          <div className="flex justify-center">
            <QuestionTable
              bottomContent={
                <Pagination
                  page={pageNumber}
                  total={parseInt(questionList?.totalPages || "1")}
                  onChange={handleOnPageClick}
                />
              }
              questions={questionList?.questions || []}
            />
          </div>
        )}
      </DefaultLayout>
    </>
  );
};

export default QuestionsPage;
