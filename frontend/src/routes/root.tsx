import Navbar from '@/components/navbar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='grid grid-cols-12'>
        <Navbar />
      </div>
    </QueryClientProvider>
  );
}

export default Root;
