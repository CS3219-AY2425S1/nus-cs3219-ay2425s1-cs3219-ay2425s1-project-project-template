'use client';

import { Skeleton } from '@/components/ui/skeleton';

const EditorSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      {/* Header row with language selector and users */}
      <div className="mb-4 flex items-center justify-between">
        {/* Language selector skeleton */}
        <Skeleton className="h-10 w-32 rounded-md bg-gray-700" />

        {/* Connected users skeleton */}
        <div className="flex gap-2">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-full bg-gray-700" />
          ))}
        </div>
      </div>

      {/* Editor skeleton */}
      <Skeleton className="h-[calc(100%-2rem)] w-full rounded-xl bg-gray-700" />
    </div>
  );
};

export default EditorSkeleton;
