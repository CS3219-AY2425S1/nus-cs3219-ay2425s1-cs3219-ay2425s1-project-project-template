import { z } from 'zod';

import { loginFormSchema } from '@/routes/login/logic';
import { signUpSchema } from '@/routes/signup/logic';
import { forgotPasswordSchema } from '@/routes/forgot-password/logic';

export type ILoginPayload = z.infer<typeof loginFormSchema>;
export type ISignUpPayload = z.infer<typeof signUpSchema>;
export type IForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;
