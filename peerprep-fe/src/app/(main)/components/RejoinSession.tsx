'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useCollaborationStore } from '@/state/useCollaborationStore';

const RejoinSession = () => {
  const { lastMatchId, clearLastMatchId } = useCollaborationStore();
  const router = useRouter();

  const handleRejoinSession = () => {
    if (lastMatchId) {
      router.push(`/collaboration?matchId=${lastMatchId}`);
    }
  };

  if (!lastMatchId) return null;

  return (
    <div className="mb-6 flex items-center justify-between rounded-lg border border-amber-500/20 bg-amber-500/10 p-4">
      <div className="flex items-center gap-3">
        <div className="text-amber-300">
          You have an active collaboration session
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="border-amber-500/50 text-amber-300 hover:bg-amber-500/20"
          onClick={handleRejoinSession}
        >
          Rejoin Session
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="text-amber-300 hover:bg-amber-500/20"
          onClick={clearLastMatchId}
        >
          Leave
        </Button>
      </div>
    </div>
  );
};

export default RejoinSession;
