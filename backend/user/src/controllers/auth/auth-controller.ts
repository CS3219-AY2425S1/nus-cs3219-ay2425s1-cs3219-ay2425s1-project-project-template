import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { loginService } from '@/services/auth/auth-logic';
import type { ILoginPayload } from '@/services/auth/types';
import { registerService } from '@/services/registration/register-logic';
import type { IRegisterPayload } from '@/services/registration/register-inputs';

export async function login(req: Request, res: Response) {
  const { username, password }: Partial<ILoginPayload> = req.body;
  if (!username || !password) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json('Malformed Request');
  }
  const { code, data, error } = await loginService({ username, password });
  if (error || code !== StatusCodes.OK || !data) {
    const sanitizedErr = error?.message ?? 'An error occurred.';
    return res.status(code).json(sanitizedErr);
  }
  return res
    .status(StatusCodes.OK)
    .cookie('jwtToken', data.cookie, { httpOnly: true })
    .json(data.user);
}

export async function logout(_req: Request, res: Response) {
  return res
    .clearCookie('jwtToken', {
      secure: true,
      sameSite: 'none',
    })
    .status(StatusCodes.OK)
    .json('User has been logged out.');
}

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
