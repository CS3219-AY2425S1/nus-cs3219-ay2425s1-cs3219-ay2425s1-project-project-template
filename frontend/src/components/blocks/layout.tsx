import { defer, Outlet, useLoaderData } from 'react-router-dom';
import NavBar from './nav-bar';
import { AuthedContextProvider } from '@/stores/auth-store';
import { QueryClient } from '@tanstack/react-query';
import { checkIsAuthed } from '@/services/user-service';

export const loader = (queryClient: QueryClient) => async () => {
  const promise = queryClient.fetchQuery({
    queryKey: ['isAuthed'],
    queryFn: async ({ signal }) => {
      return await checkIsAuthed({ signal });
    },
  });
  // const promise = new Promise((resolve, _reject) => {
  //   setTimeout(() => {
  //     console.log('resolved');
  //     resolve('loaded!');
  //   }, 3000);
  // })
  return defer({
    isAuthed: promise,
  });
};

export function Layout() {
  const { isAuthed } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>['data'];
  return (
    <AuthedContextProvider isAuthed={isAuthed as boolean}>
      <div className='text-text bg-background flex min-h-screen flex-col'>
        <NavBar />
        <main className='flex flex-1'>
          <Outlet />
        </main>
      </div>
    </AuthedContextProvider>
  );
}
