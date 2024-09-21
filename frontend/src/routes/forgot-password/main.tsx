import { ForgotPasswordForm } from '@/routes/forgot-password';

export const ForgotPassword = () => {
  return (
    <div className='grid w-full grid-cols-1'>
      <div className='flex items-center justify-center'>
        <div className='size-full py-8'>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
};
