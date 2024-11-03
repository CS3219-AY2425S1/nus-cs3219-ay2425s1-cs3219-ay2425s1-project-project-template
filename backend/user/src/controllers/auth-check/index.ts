import { eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';

import { COOKIE_NAME, decodeCookie, isCookieValid } from '@/lib/cookies';
import { db, users } from '@/lib/db';
import { logger } from '@/lib/utils';
import { IRouteHandler } from '@/types';

export const checkIsAuthed: IRouteHandler = async (req, res) => {
  const cookie: string | undefined = req.cookies[COOKIE_NAME];

  if (cookie && isCookieValid(cookie)) {
    const decoded = decodeCookie(cookie);
    const expireTimeInMillis = decoded.exp * 1000;
    logger.info(
      '[/auth-check/check-is-authed]: Expires At ' + new Date(expireTimeInMillis).toLocaleString()
    );
    const user = await db
      .select({ name: users.username })
      .from(users)
      .where(eq(users.id, decoded.id))
      .limit(1);
    return res.status(StatusCodes.OK).json({
      message: 'OK',
      expiresAt: expireTimeInMillis,
      userId: decoded.id,
      username: user.length > 0 ? user[0].name : undefined,
    });
  }

  return res.status(StatusCodes.UNAUTHORIZED).json('Unauthorised');
};
