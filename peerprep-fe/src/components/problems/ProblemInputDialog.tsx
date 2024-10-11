import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { getDifficultyString } from '@/lib/utils';
import { ProblemDialogData } from '@/types/types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  problem: ProblemDialogData | null;
  requestCallback: () => void;
  requestTitle: string;
};

function ProblemInputDialog({
  isOpen,
  onClose,
  problem,
  requestCallback,
  requestTitle,
}: Props) {
  if (!problem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black">
        <DialogHeader>
          <DialogTitle>{problem.title}</DialogTitle>
          <DialogDescription>
            Difficulty: {getDifficultyString(problem.difficulty)}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <h3 className="mb-2 text-lg font-semibold">Description:</h3>
          <p>{problem.description}</p>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={requestCallback}>
            {requestTitle}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProblemInputDialog;
