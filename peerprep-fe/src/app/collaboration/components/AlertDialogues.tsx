'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface LeaveSessionDialogProps {
  onLeave: () => void;
  triggerClassName?: string;
}

const LeaveSessionDialog = ({
  onLeave,
  triggerClassName = 'border border-amber-700/50 bg-amber-950/90 text-amber-100 hover:bg-amber-900/90',
}: LeaveSessionDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" className={triggerClassName}>
          Leave Session
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-black">
        <AlertDialogHeader>
          <AlertDialogTitle>Leave Collaboration Session?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to leave this session? Any unsaved progress
            will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onLeave}
            className="border border-amber-700/50 bg-amber-950/90 text-amber-100 hover:bg-amber-900/90"
          >
            Leave Session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LeaveSessionDialog;
