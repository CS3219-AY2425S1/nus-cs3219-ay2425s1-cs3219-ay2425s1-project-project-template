import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { getQuestionDetails } from '@/services/question-service';
import { QueryClient, queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

const questionDetailsQuery = (id: number) =>
  queryOptions({
    queryKey: ['qn', 'details', id],
    queryFn: async ({ signal: _ }) => getQuestionDetails(id),
  });

export const loader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const questionId = Number.parseInt(params.questionId ?? '1') ?? 1;
    await queryClient.ensureQueryData(questionDetailsQuery(questionId));
    return { questionId };
  };

export const QuestionDetails = () => {
  const { questionId } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>;
  const { data: details } = useSuspenseQuery(questionDetailsQuery(questionId));
  return (
    <Card>
      <CardHeader>
        <CardTitle>{details.title}</CardTitle>
        <div className='flex flex-col gap-2'>
          <Badge className='flex w-min grow-0'>{details.difficulty}</Badge>
          <div className='flex flex-wrap items-center gap-1'>
            {details.topics.map((v, i) => (
              <Badge className='flex w-min grow-0 whitespace-nowrap' key={i}>
                {v}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
