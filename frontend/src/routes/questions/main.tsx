import { useEffect, useState } from 'react';
import { columns } from './table-columns';
import { QuestionTable } from './question-table';
import { useInfiniteQuery } from '@tanstack/react-query';
import { IGetQuestionsResponse, Question } from '@/types/question-types';
import { useCrumbs } from '@/lib/hooks/use-crumbs';
import { WithNavBanner } from '@/components/blocks/authed/with-nav-banner';
import { dummyData } from '@/assets/dummyData';

const ROWS_PER_PAGE = 12;
async function fetchQuestions(): Promise<IGetQuestionsResponse> {
  return {
    questions: dummyData,
    totalQuestions: 20,
  };
}

export function Questions() {
  const { crumbs } = useCrumbs();

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
    <WithNavBanner crumbs={crumbs}>
      <div className='container mx-auto py-3'>
        <QuestionTable columns={columns} data={questions} isError={isError} />
      </div>
    </WithNavBanner>
  );
}
