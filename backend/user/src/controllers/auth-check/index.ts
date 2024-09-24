import { StatusCodes } from 'http-status-codes';

import { COOKIE_NAME, isCookieValid } from '@/lib/cookies';
import { IRouteHandler } from '@/types';

export const checkIsAuthed: IRouteHandler = async (req, res) => {
  const cookie: string | undefined = req.cookies[COOKIE_NAME];
  if (cookie && isCookieValid(cookie)) {
    return res.status(StatusCodes.OK).json('OK');
  }
  return res.status(StatusCodes.UNAUTHORIZED).json('Unauthorised');
};
