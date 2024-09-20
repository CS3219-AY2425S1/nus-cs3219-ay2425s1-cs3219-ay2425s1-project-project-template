import { observer } from 'mobx-react';

import { Hero, LoginForm } from '@/components/routes/login';

export const Login = observer(() => {
  return (
    <div className='grid w-full grid-cols-1 md:grid-cols-[3fr_2fr]'>
      <Hero />
      <div className='flex items-center justify-center'>
        <LoginForm />
      </div>
    </div>
  );
});
