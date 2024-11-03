import type { FC, PropsWithChildren } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IQuestionAttempt } from '@/types/question-types';

type AttemptDetailsPaneProps = {
  triggerText: string;
} & IQuestionAttempt;

export const AttemptDetailsDialog: FC<PropsWithChildren<AttemptDetailsPaneProps>> = ({
  children,
  triggerText,
  code,
  language,
  attemptId,
}) => {
  return (
    <Dialog>
      {children ? (
        <DialogTrigger>{children}</DialogTrigger>
      ) : (
        <DialogTrigger>{triggerText}</DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Attempt&nbsp;<span className='font-mono'>{attemptId}</span>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription />
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
};
