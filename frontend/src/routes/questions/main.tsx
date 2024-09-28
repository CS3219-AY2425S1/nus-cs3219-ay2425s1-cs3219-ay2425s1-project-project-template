import { useEffect, useMemo } from 'react';
import { columns } from './table-columns';
import { QuestionTable } from './question-table';
import { useInfiniteQuery } from '@tanstack/react-query';
import { IGetQuestionsResponse } from '@/types/question-types';
import { useCrumbs } from '@/lib/hooks/use-crumbs';
import { WithNavBanner } from '@/components/blocks/authed/with-nav-banner';
import { fetchQuestions, ROWS_PER_PAGE } from '@/services/question-service';

export function Questions() {
  const { crumbs } = useCrumbs();

  const { data, error, fetchNextPage, hasNextPage, isError, isFetchingNextPage } = useInfiniteQuery<
    IGetQuestionsResponse,
    Error
  >({
    queryKey: ['questions'],
    queryFn: ({ pageParam }) => fetchQuestions(pageParam as number | undefined),
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

  const questions = useMemo(() => {
    if (data) {
      return data.pages.flatMap((page) => page.questions);
    }
    return [];
  }, [data]);

  return (
    <WithNavBanner crumbs={crumbs}>
      <div className='container mx-auto py-3'>
        <QuestionTable columns={columns} data={questions} isError={isError} />
      </div>
    </WithNavBanner>
  );
}
