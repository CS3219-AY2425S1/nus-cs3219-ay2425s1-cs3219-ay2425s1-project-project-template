import {
  getEmptyFieldErrorMessage,
  getFieldMaxLengthErrorMessage,
  getFieldMinLengthErrorMessage,
} from '@/lib/forms';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const signUpSchema = z
  .object({
    email: z.string().email().min(1, getEmptyFieldErrorMessage('Email')),
    username: z
      .string()
      .min(2, getFieldMinLengthErrorMessage('Username', 2))
      .max(50, getFieldMaxLengthErrorMessage('Username', 50)),
    firstName: z
      .string()
      .min(2, getFieldMinLengthErrorMessage('First Name', 2))
      .max(50, getFieldMaxLengthErrorMessage('First Name', 50)),
    lastName: z
      .string()
      .min(2, getFieldMinLengthErrorMessage('Last Name', 2))
      .max(50, getFieldMaxLengthErrorMessage('Last Name', 50)),
    password: z.string().min(8, getFieldMinLengthErrorMessage('Password', 8)),
    confirmPassword: z.string().min(8, getFieldMinLengthErrorMessage('Password', 8)),
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
