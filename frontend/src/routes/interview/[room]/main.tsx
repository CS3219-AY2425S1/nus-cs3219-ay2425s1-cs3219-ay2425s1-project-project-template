import { LoaderFunctionArgs, Navigate, useLoaderData } from 'react-router-dom';

import { Editor } from '@/components/blocks/interview/editor';
import { Card } from '@/components/ui/card';
import { ROUTES } from '@/lib/routes';

export const loader = ({ params, request }: LoaderFunctionArgs) => {
  const roomId = params.roomId;
  const url = new URL(request.url);
  const questionId = url.searchParams.get('questionId');

  // TODO: Load question data (copy from question loader)

  return {
    roomId,
    questionId,
  };
};

export const InterviewRoom = () => {
  const { roomId, questionId } = useLoaderData() as ReturnType<typeof loader>;
  return !questionId || !roomId ? (
    <Navigate to={ROUTES.HOME} />
  ) : (
    <div className='flex flex-1 overflow-hidden'>
      <Card className='border-border m-4 w-1/3 max-w-[500px] overflow-hidden p-4 md:w-2/5'>
        {/* Question Deets */}
      </Card>
      <div className='flex flex-1 flex-col overflow-hidden'>
        <Editor room={roomId as string} />
      </div>
    </div>
  );
};
