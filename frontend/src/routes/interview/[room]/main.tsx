import { QueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { type LoaderFunctionArgs, Navigate, useLoaderData } from 'react-router-dom';

import { WithNavBanner, WithNavBlocker } from '@/components/blocks/authed';
import { AIChat } from '@/components/blocks/interview/ai-chat';
import { Editor } from '@/components/blocks/interview/editor';
import { PartnerChat } from '@/components/blocks/interview/partner-chat';
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
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isPartnerChatOpen, setIsPartnerChatOpen] = useState(false);

  const handleAIClick = () => {
    setIsPartnerChatOpen(false);
    setIsAIChatOpen(!isAIChatOpen);
  };

  const handlePartnerClick = () => {
    setIsAIChatOpen(false);
    setIsPartnerChatOpen(!isPartnerChatOpen);
  };

  return !questionId || !roomId ? (
    <Navigate to={ROUTES.HOME} />
  ) : (
    <WithNavBlocker>
      <WithNavBanner crumbs={crumbs}>
        <div className='flex flex-1 overflow-hidden'>
          <Card className='border-border m-4 w-1/3 overflow-hidden p-4 md:w-2/5'>
            <QuestionDetails {...{ questionDetails }} />
          </Card>
          <div className='flex w-full'>
            <Editor
              room={roomId as string}
              onAIClick={handleAIClick}
              onPartnerClick={handlePartnerClick}
            />
          </div>
          {(isAIChatOpen || isPartnerChatOpen) && (
            <Card className='border-border m-4 w-1/3 overflow-hidden'>
              {isAIChatOpen && (
                <AIChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
              )}
              {isPartnerChatOpen && (
                <PartnerChat
                  roomId={roomId as string}
                  isOpen={isPartnerChatOpen}
                  onClose={() => setIsPartnerChatOpen(false)}
                />
              )}
            </Card>
          )}
        </div>
      </WithNavBanner>
    </WithNavBlocker>
  );
};
