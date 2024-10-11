import { observer } from 'mobx-react';
import { MatchForm } from './match-form';
import { Suspense } from 'react';
import { useLoaderData, Await } from 'react-router-dom';

export const Match = observer(() => {
  const { topics } = useLoaderData() as { topics: Promise<string[]> };

  return (
    <div className='m-auto flex md:max-w-sm'>
      <Suspense fallback={<div>Loading topics...</div>}>
        <Await resolve={topics}>
          {(resolvedTopics) => <MatchForm topics={resolvedTopics.topics} />}
        </Await>
      </Suspense>
    </div>
  );
});
