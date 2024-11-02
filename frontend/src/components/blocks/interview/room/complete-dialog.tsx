import { useMutation } from '@tanstack/react-query';
import { FC, PropsWithChildren, useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IYjsUserState } from '@/types/collab-types';

type CompleteDialogProps = {
  questionId: number;
  code: string;
  members: Array<IYjsUserState['user']>;
  setCompleting: (state: string, resetId?: boolean) => void;
};

export const CompleteDialog: FC<PropsWithChildren<CompleteDialogProps>> = ({
  children,
  setCompleting,
}) => {
  const [isOpen, _setIsOpen] = useState(false);
  const setIsOpen = useCallback(
    (openState: boolean) => {
      _setIsOpen(openState);

      if (openState) {
        setCompleting('pending');
      } else {
        setCompleting('', true);
      }
    },
    [isOpen]
  );

  const { mutate: _m } = useMutation({
    mutationFn: async () => {},
    onSuccess: () => {
      setCompleting('success');
      // Navigate to home page
    },
    onError: () => {},
  });

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='border-border'>
        <DialogHeader className='text-primary text-lg font-medium'>
          Are you sure you wish to mark this question as complete?
        </DialogHeader>
        <DialogFooter>
          <div className='flex w-full justify-between'>
            <Button
              variant='secondary'
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Go Back
            </Button>
            <Button>Complete Question</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
