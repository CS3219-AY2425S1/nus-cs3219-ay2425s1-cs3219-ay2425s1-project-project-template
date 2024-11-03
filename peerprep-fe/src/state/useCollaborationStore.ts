import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CollaborationState {
  lastMatchId: string | null;
  setLastMatchId: (matchId: string | null) => void;
  clearLastMatchId: () => void;
}

export const useCollaborationStore = create<CollaborationState>()(
  persist(
    (set) => ({
      lastMatchId: null,
      setLastMatchId: (matchId) => set({ lastMatchId: matchId }),
      clearLastMatchId: () => set({ lastMatchId: null }),
    }),
    {
      name: 'collaboration-storage',
    },
  ),
);
