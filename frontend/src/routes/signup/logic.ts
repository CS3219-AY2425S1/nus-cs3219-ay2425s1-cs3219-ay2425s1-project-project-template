import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import {
  getEmptyFieldErrorMessage,
  getFieldMaxLengthErrorMessage,
  getFieldMinLengthErrorMessage,
} from '@/lib/forms';
import { signUp } from '@/services/user-service';

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

export const useSignupForm = () => {
  const navigate = useNavigate();

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

  const {
    mutate: sendSignUpRequest,
    status,
    isPending,
  } = useMutation({
    mutationFn: signUp,
    onSuccess: (response, _params, _context) => {
      console.log(response);
      form.reset();
      // TODO: Add email validation page OR sign user in
      navigate('/');
    },
  });

  const onSubmit = (formData: ISignupFormSchema) => {
    const parseResult = signUpSchema.safeParse(formData);
    if (parseResult.error || !parseResult.data) {
      console.error('An error occurred: ' + JSON.stringify(formData));
      return;
    }
    const { confirmPassword, ...payload } = parseResult.data;
    sendSignUpRequest(payload);
  };

  return { form, onSubmit: form.handleSubmit(onSubmit), status, isPending };
};
