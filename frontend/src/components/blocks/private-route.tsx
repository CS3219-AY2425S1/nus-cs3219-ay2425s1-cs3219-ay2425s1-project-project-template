import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';

import { Sheet, SheetOverlay, SheetPortal } from '@/components/ui/sheet';

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const isLoading = true;
  //const isAuthenticated = checkUserAuthentication();
  const isAuthenticated = true;
  return isLoading ? (
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
  ) : isAuthenticated ? (
    children
  ) : (
    <Navigate to='/login' />
  );
}
