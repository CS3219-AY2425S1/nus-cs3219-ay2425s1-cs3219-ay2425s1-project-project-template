import express from 'express';
import { COOKIE_NAME, isCookieValid } from '@/lib/cookies';
import { StatusCodes } from 'http-status-codes';
import { logger } from '@/lib/utils';

const router = express.Router();

router.get('/is-authed', async (req, res) => {
  logger.info(req.cookies);
  const authToken: string | undefined = req.cookies[COOKIE_NAME];
  if (authToken && isCookieValid(authToken)) {
    return res.status(StatusCodes.OK);
  }
  return res.status(StatusCodes.UNAUTHORIZED);
});

export default router;
