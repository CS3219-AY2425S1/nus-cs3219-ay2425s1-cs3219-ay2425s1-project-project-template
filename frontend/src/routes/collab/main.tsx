import { getQuestionDetails } from '@/services/question-service';
import { DetailsCard } from '../questions/details/details-card';
import { QueryClient, queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

const questionDetailsQuery = (id: number) =>
  queryOptions({
    queryKey: ['qn', 'details', id],
    queryFn: async ({ signal: _ }) => getQuestionDetails(id),
  });

export const loader =
  (queryClient: QueryClient) =>
  async ({ request, params }: LoaderFunctionArgs) => {
    const searchParams = new URL(request.url).searchParams;
    const questionId = Number.parseInt(searchParams.get('questionId') ?? '1');
    console.log('Extracted questionId:', questionId); // Log the extracted questionId

    await queryClient.ensureQueryData(questionDetailsQuery(questionId));

    return { roomId: params.roomId, questionId };
  };

export const Collab = () => {
  const { questionId } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>;
  const { data: details } = useSuspenseQuery(questionDetailsQuery(questionId));

  const questionDetails = useMemo(() => {
    return details.question;
  }, [details]);

  return (
    <div className='flex flex-1 overflow-hidden'>
      <DetailsCard questionDetails={questionDetails} />
      <div className='flex flex-1 flex-col' />
    </div>
  );
};
