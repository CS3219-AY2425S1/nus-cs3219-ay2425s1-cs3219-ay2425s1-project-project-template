import { Outlet } from 'react-router-dom';
import NavBar from './nav-bar';

export function Layout() {
  return (
    <div className='text-text flex min-h-screen flex-col'>
      <NavBar />
      <main className='bg-background flex flex-1'>
        <Outlet />
      </main>
    </div>
  );
}
