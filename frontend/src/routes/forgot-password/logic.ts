import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

type IForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

const onSubmit = (_formData: IForgotPasswordSchema) => {};

export const useForgotPasswordForm = () => {
  const form = useForm<IForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onSubmit',
  });

  return { form, onSubmit: form.handleSubmit(onSubmit) };
};
