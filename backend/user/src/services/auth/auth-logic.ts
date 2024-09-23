import { eq, getTableColumns, sql } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { db, users } from '@/lib/db';
import type { ILoginPayload } from './types';

// TODO: Set env var and rotate automatically
const _JWT_SECRET_KEY = 'secret';

const _FAILED_ATTEMPTS_ALLOWED = 3;
const _getSchema = () => {
  const { id, username, password, email, failedAttempts, unlockTime } = getTableColumns(users);
  return {
    id,
    username,
    password,
    email,
    failedAttempts,
    unlockTime,
  };
};
export const loginService = async (payload: ILoginPayload) => {
  const rows = await db
    .select(_getSchema())
    .from(users)
    .where(eq(users.username, payload.username))
    .limit(1);

  // 1. Cannot find
  if (rows.length === 0) {
    return {
      code: StatusCodes.NOT_FOUND,
      error: {
        message: 'Not Found',
      },
    };
  }
  const { unlockTime, password, failedAttempts, ...user } = rows[0];

  // 2. Locked out
  if (unlockTime !== null) {
    const currentTime = new Date();
    if (unlockTime > currentTime) {
      return {
        code: StatusCodes.CONFLICT,
        error: {
          message: 'Too many failed attempts - try again later',
        },
      };
    }
  }

  // 3. Wrong Password
  const isPasswordValid = bcrypt.compareSync(payload.password, password);
  if (!isPasswordValid) {
    const newFailedAttempts = (failedAttempts ?? 0) + 1;
    const updateValues = {
      failedAttempts: newFailedAttempts,
      unlockTime:
        newFailedAttempts >= _FAILED_ATTEMPTS_ALLOWED ? sql`NOW() + INTERVAL '1 hour'` : undefined,
    };
    await db.update(users).set(updateValues).where(eq(users.username, payload.username));
    return {
      code: StatusCodes.UNAUTHORIZED,
      error: {
        message: 'Incorrect Password',
      },
    };
  }

  // 4. Correct Password
  if ((failedAttempts !== null && failedAttempts > 0) || unlockTime !== null) {
    await db.update(users).set({
      failedAttempts: null,
      unlockTime: null,
    });
  }
  const jwtToken = jwt.sign({ id: user.id }, _JWT_SECRET_KEY);
  return {
    code: StatusCodes.OK,
    data: {
      cookie: jwtToken,
      user,
    },
  };
};
