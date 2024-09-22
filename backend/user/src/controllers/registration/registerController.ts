import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { registerService } from '@/services/registration/register-logic';
import type { IRegisterPayload } from '@/services/registration/register-inputs';

export async function register(req: Request, res: Response) {
  //Extract the registration data from the request body
  const { email, username, password, firstName, lastName }: Partial<IRegisterPayload> = req.body;

  //Validate input
  if (!username || !password || !email || !firstName || !lastName) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json('Malformed Request');
  }

  //Call the registration service
  const { code, data, error } = await registerService({
    email,
    username,
    firstName,
    lastName,
    password,
  });

  //Handle errors
  if (error || code !== StatusCodes.CREATED || !data) {
    const sanitizedErr = error?.message ?? 'An error occurred during registration.';
    return res.status(code).json(sanitizedErr);
  }

  return res.status(StatusCodes.CREATED).json({
    message: 'User registered successfully',
    user: data.user, // Return user data if needed
  });
}
