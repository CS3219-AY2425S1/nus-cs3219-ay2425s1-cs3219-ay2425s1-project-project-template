"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onDelete: () => void;
  questionTitle: string;
}

export default function DeleteModal({
  open,
  setOpen,
  onDelete,
  questionTitle,
}: DeleteModalProps) {
  const handleDelete = () => {
    onDelete();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Question</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Are you sure you want to delete the question "{questionTitle}"?</p>
          <p>This action cannot be undone.</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
