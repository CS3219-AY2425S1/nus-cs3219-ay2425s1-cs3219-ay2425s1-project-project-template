import { LoginForm } from '@/components/blocks/login-form';
import { observer } from 'mobx-react';

export const Login = observer(() => {
  return (
    <div className='grid w-full grid-cols-1 md:grid-cols-[3fr_2fr]'>
      <div className='p-15 hidden h-full flex-col items-center justify-center pl-20 md:flex'>
        <div className='text-center text-5xl'>Interview with real people.</div>
        <div className='pt-6 text-center text-xl'>
          Pick a difficulty level and/or topic. We’ll pair you with a real partner for a tech
          interview experience.
        </div>
      </div>
      <div className='flex items-center justify-center'>
        <LoginForm />
      </div>
    </div>
  );
});
