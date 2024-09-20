import bcrypt from 'bcrypt';
import { eq, sql } from 'drizzle-orm';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import type { LoginCredentials } from '@/controllers/auth/types/auth-types';
import { db, users } from '@/lib/db';

const FAILED_ATTEMPTS_ALLOWED = 3;

export async function login(req: Request, res: Response) {
  const { username, password }: LoginCredentials = req.body;
  const userArray = await db.select().from(users).where(eq(users.username, username));
  if (userArray.length === 0) {
    return res.status(StatusCodes.NOT_FOUND).json('Account does not exist');
  }

  const user = userArray[0];

  if (user.unlockTime !== null) {
    // TODO: Validate timezone accuracy
    const currentTime = new Date();
    if (user.unlockTime > currentTime) {
      return res.status(StatusCodes.CONFLICT).json('Too many failed attempts');
    }
  }
  const checkPassword = bcrypt.compareSync(password, user.password);
  if (!checkPassword) {
    const failedAttempts = (user.failedAttempts ?? 0) + 1;
    const updateValues = {
      failedAttempts,
      unlockTime:
        failedAttempts >= FAILED_ATTEMPTS_ALLOWED ? sql`NOW() + INTERVAL '1 hour'` : undefined,
    };
    await db.update(users).set(updateValues).where(eq(users.username, username));

    return res.status(StatusCodes.UNAUTHORIZED).json('Incorrect Password');
  }

  if (user.failedAttempts !== null && user.failedAttempts > 0) {
    await db.update(users).set({ failedAttempts: 0 }).where(eq(users.username, username));
  }

  const { password: _userPassword, ...userDetails } = user;
  const jwtToken = jwt.sign({ id: user.id }, 'key');
  return res
    .cookie('jwtToken', jwtToken, { httpOnly: true })
    .status(StatusCodes.OK)
    .json(userDetails);
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
