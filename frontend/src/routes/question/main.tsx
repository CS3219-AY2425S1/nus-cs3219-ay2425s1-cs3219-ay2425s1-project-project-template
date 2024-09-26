import { useEffect, useState } from 'react';
import { columns } from './table-columns';
import { QuestionTable } from './question-table';
import { fetchQuestions, Question, ROWS_PER_PAGE } from './logic';
import { useInfiniteQuery } from '@tanstack/react-query';
import { IGetQuestionsResponse } from '@/types/question-types';

export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>([]);

  const { data, error, fetchNextPage, hasNextPage, isError, isFetchingNextPage } = useInfiniteQuery<
    IGetQuestionsResponse,
    Error
  >({
    queryKey: ['questions'],
    queryFn: fetchQuestions,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages.length;
      const totalPages = Math.ceil(lastPage.totalQuestions / ROWS_PER_PAGE);
      return nextPage < totalPages ? nextPage : undefined;
    },
  });

  if (isError) {
    console.log(error);
  }

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (data) {
      const newQuestions = data.pages.flatMap((page) => page.questions);
      setQuestions(newQuestions);
    }
  }, [data]);

  return (
    <div className='container mx-auto py-10'>
      <QuestionTable columns={columns} data={questions} isError={isError} />
    </div>
  );
}
