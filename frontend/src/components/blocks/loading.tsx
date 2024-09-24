import { LoaderCircle } from 'lucide-react';
import { Sheet, SheetPortal, SheetOverlay } from '@/components/ui/sheet';

export const Loading = () => {
  return (
    <Sheet open>
      <SheetPortal>
        <SheetOverlay>
          <div className='text-primary-foreground z-[60] flex h-screen w-screen items-center justify-center'>
            <div className='inline-flex items-center gap-2'>
              <LoaderCircle className='animate-spin' />
              <span className='font-medium'>Loading...</span>
            </div>
          </div>
        </SheetOverlay>
      </SheetPortal>
    </Sheet>
  );
};
