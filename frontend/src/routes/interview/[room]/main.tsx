import { QueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { type LoaderFunctionArgs, Navigate, useLoaderData } from 'react-router-dom';

import { WithNavBanner, WithNavBlocker } from '@/components/blocks/authed';
import { Editor } from '@/components/blocks/interview/editor';
import { FloatingChatButton } from '@/components/blocks/interview/floating-chat-button';
import { QuestionDetails } from '@/components/blocks/questions/details';
import { Card } from '@/components/ui/card';
import { useCrumbs } from '@/lib/hooks';
import { questionDetailsQuery } from '@/lib/queries/question-details';
import { ROUTES } from '@/lib/routes';

export const loader =
  (queryClient: QueryClient) =>
  async ({ params, request }: LoaderFunctionArgs) => {
    const roomId = params.roomId;
    const url = new URL(request.url);
    const questionId = Number.parseInt(url.searchParams.get('questionId')!);
    await queryClient.ensureQueryData(questionDetailsQuery(questionId));
    return {
      roomId,
      questionId,
    };
  };

export const InterviewRoom = () => {
  const { questionId, roomId } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>;
  const { crumbs } = useCrumbs();
  const { data: details } = useSuspenseQuery(questionDetailsQuery(questionId));
  const questionDetails = useMemo(() => details.question, [details]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return !questionId || !roomId ? (
    <Navigate to={ROUTES.HOME} />
  ) : (
    <WithNavBlocker>
      <WithNavBanner crumbs={crumbs}>
        <div className='flex'>
          <div className={`flex ${isChatOpen ? 'w-4/5' : 'w-full'} transition-all duration-300`}>
            <Card className='border-border m-4 w-1/3 max-w-[500px] overflow-hidden p-4 md:w-2/5'>
              <QuestionDetails {...{ questionDetails }} />
            </Card>
            <div
              className={`flex flex-1 ${isChatOpen ? 'w-2/3' : 'w-full'} transition-all duration-300`}
            >
              <Editor room={roomId as string} />
            </div>
          </div>
          <FloatingChatButton room={roomId as string} onChatOpenChange={setIsChatOpen} />
        </div>
      </WithNavBanner>
    </WithNavBlocker>
  );
};
