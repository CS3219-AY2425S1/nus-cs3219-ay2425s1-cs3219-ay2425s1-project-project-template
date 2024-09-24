import { QueryClient, queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import Markdown from 'react-markdown';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getQuestionDetails } from '@/services/question-service';

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
        <div className='flex flex-col gap-4'>
          <div className='flex w-full items-center gap-4'>
            <CardTitle className='text-2xl'>{details.title}</CardTitle>
            <Badge className='flex w-min grow-0'>{details.difficulty}</Badge>
          </div>
          <div className='flex flex-wrap items-center gap-1'>
            {details.topics.map((v, i) => (
              <Badge className='flex w-min grow-0 whitespace-nowrap' key={i}>
                {v}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Markdown
          rehypePlugins={[rehypeKatex]}
          remarkPlugins={[remarkMath, remarkGfm]}
          className='prose prose-neutral'
        >
          {details.description}
        </Markdown>
      </CardContent>
    </Card>
  );
};
