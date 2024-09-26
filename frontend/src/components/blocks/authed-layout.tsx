import { observer } from 'mobx-react';
import { Outlet } from 'react-router-dom';

export const AuthedLayout = observer(() => {
  return (
    <div id='main' className='flex h-[calc(100dvh-64px)] w-full flex-col overscroll-contain'>
      <Outlet />
    </div>
    // <div id='main' className='bg-background flex size-full min-h-screen flex-col'>
    // {/* Body */}
    // <div className='container'>
    // <Outlet />
    // </div>
    // </div>
  );
});
