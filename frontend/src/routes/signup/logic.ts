import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const signUpSchema = z
  .object({
    email: z.string().email(),
    username: z.string().min(2).max(50),
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      });
    }
  });

type ISignupFormSchema = z.infer<typeof signUpSchema>;

const onSubmit = (_formData: ISignupFormSchema) => {};

export const useSignupForm = () => {
  const form = useForm<ISignupFormSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      username: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
  });

  return { form, onSubmit: form.handleSubmit(onSubmit) };
};
