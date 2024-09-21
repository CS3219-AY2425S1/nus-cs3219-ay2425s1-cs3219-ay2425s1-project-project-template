import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';

import { getEmptyFieldErrorMessage } from '@/lib/forms';

export const loginFormSchema = z.object({
  username: z.string().min(1, getEmptyFieldErrorMessage('Username')),
  password: z.string().min(1, getEmptyFieldErrorMessage('Password')),
});

type ILoginFormSchema = z.infer<typeof loginFormSchema>;

const onSubmit = (_formData: ILoginFormSchema) => {
  // eslint-disable-next-line no-console
  console.log(_formData);
};

export const useLoginForm = () => {
  const form = useForm<ILoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  return { form, onSubmit: form.handleSubmit(onSubmit) };
};
