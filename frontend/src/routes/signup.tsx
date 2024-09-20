import { SignUpForm } from '@/components/blocks/signup-form';
import { observer } from 'mobx-react';

export const SignUp = observer(() => {
  return (
    <div className='grid w-full grid-cols-1'>
      <div className='flex items-center justify-center'>
        <SignUpForm />
      </div>
    </div>
  );
});
