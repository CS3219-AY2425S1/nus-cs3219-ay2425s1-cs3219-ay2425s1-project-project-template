import { observer } from 'mobx-react';

import { SignUpForm } from '@/components/routes/signup';

export const SignUp = observer(() => {
  return (
    <div className='grid w-full grid-cols-1'>
      <div className='flex items-center justify-center'>
        <div className='size-full py-8'>
          <SignUpForm />
        </div>
      </div>
    </div>
  );
});
