import { create } from 'zustand';

interface QuestionState {
  dialogOpen: boolean; // State for dialog visibility
  toggleDialogOpen: () => void; // Function to set dialog state
}

export const useQuestionStore = create<QuestionState>((set) => ({
  dialogOpen: false,
  toggleDialogOpen: () => set((state) => ({ dialogOpen: !state.dialogOpen })),
}));
