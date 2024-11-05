import React, { ReactElement } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  description: string;
  callback?: () => void;
  callbackTitle?: string;
  children?: ReactElement;
};

const ActionDialog = ({
  isOpen,
  onClose,
  title,
  subtitle,
  description,
  callback,
  callbackTitle,
  children,
}: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80%] overflow-auto bg-black">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{subtitle}</DialogDescription>
        </DialogHeader>
        {children ? (
          children
        ) : (
          <div className="mt-4">
            <h3 className="mb-2 text-lg font-semibold">Description:</h3>
            <p>{description}</p>
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={callback}>
            {callbackTitle}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActionDialog;
