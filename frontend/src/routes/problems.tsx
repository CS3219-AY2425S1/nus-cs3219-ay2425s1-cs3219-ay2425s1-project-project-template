import { useSample } from '@/hooks/sample';
import { Loader2 } from 'lucide-react';

export default function ProblemsRoute() {
  const { data, isLoading } = useSample();

  if (isLoading || !data) {
    return (
      <div className='flex flex-col items-center justify-center h-full'>
        <Loader2 className='w-4 h-4 animate-spin' />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center h-full'>
      <p>ID: {data.id}</p>
      <p>Title: {data.title}</p>
    </div>
  );
}
