import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { loginService } from '@/services/auth';
import type { ILoginPayload } from '@/services/auth/types';

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
