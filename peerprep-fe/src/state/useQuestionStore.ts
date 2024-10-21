import { create } from 'zustand';

interface QuestionState {
  dialogOpen: boolean; // State for dialog visibility
  setDialog: (open: boolean) => void; // Function to set dialog state
}

export const useQuestionStore = create<QuestionState>((set) => ({
  dialogOpen: false,
  setDialog: (open) => set({ dialogOpen: open }),
}));
