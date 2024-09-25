import { QueryClient, queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import Markdown from 'react-markdown';
import { Link, LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getQuestionDetails } from '@/services/question-service';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Fragment } from 'react/jsx-runtime';
import { cn } from '@/lib/utils';

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

const BreadCrumbLinks = ({ id, title }: { id: number; title: string }) => {
  const links = [
    {
      link: '/',
      label: 'Home',
    },
    {
      link: '/questions',
      label: 'Questions',
    },
    {
      link: '/questions/' + id,
      label: '1. ' + title,
      isCurrent: true,
    },
  ];
  return links.map(({ link, label, isCurrent }, index) => (
    <Fragment key={index}>
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link to={link} className={cn(isCurrent && 'text-secondary-foreground')}>
            {label}
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      {index < links.length - 1 && <BreadcrumbSeparator />}
    </Fragment>
  ));
};

export const QuestionDetails = () => {
  const { questionId } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>;
  const { data: details } = useSuspenseQuery(questionDetailsQuery(questionId));
  return (
    <div className='flex h-[calc(100dvh-64px)] w-full flex-col'>
      <div className='bg-secondary/50 flex w-full p-4 px-6'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadCrumbLinks id={details.id} title={details.title} />
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className='flex flex-1 overflow-hidden'>
        <Card className='border-border m-4 w-1/3 max-w-[500px] overflow-hidden p-4 md:w-2/5'>
          <ScrollArea className='h-full'>
            <CardHeader>
              <div className='flex flex-col gap-4'>
                <div className='flex w-full items-center gap-4'>
                  <CardTitle className='text-2xl'>
                    {details.id}.&nbsp;{details.title}
                  </CardTitle>
                </div>
                <div className='flex flex-wrap items-center gap-1'>
                  <Badge variant='secondary' className='flex w-min grow-0'>
                    {details.difficulty}
                  </Badge>
                  <Separator orientation='vertical' className='mx-2 h-4' />
                  <span className='text-sm font-medium'>Topics:</span>
                  {details.topics.map((v, i) => (
                    <Badge
                      variant='secondary'
                      className='flex w-min grow-0 whitespace-nowrap'
                      key={i}
                    >
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
                className='prose prose-neutral text-card-foreground prose-strong:text-card-foreground leading-normal'
                components={{
                  code: ({ children, className, ...rest }) => {
                    // const isCodeBlock = /language-(\w+)/.exec(className || '');

                    return (
                      <code
                        {...rest}
                        className='bg-secondary text-secondary-foreground rounded px-1.5 py-1 font-mono'
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {details.description}
              </Markdown>
            </CardContent>
          </ScrollArea>
        </Card>
        <div className='flex flex-1 flex-col' />
      </div>
    </div>
  );
};
