import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';

export const OtherUserCompletingDialog = () => {
  return (
    <Dialog open>
      <DialogContent className='text-primary border-border'>
        <DialogHeader className='text-lg font-medium'>
          The other user is marking this question attempt as complete. Please wait...
        </DialogHeader>
        <div className='bg-background absolute right-3 top-3 z-50 size-6' />
      </DialogContent>
    </Dialog>
  );
};
