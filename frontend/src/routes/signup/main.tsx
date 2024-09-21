import { SignUpForm } from '@/routes/signup';

export const SignUp = () => {
  return (
    <div className='grid w-full grid-cols-1'>
      <div className='flex items-center justify-center'>
        <div className='size-full py-8'>
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};
