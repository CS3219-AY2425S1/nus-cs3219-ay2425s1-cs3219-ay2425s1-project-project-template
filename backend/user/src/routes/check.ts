import express from 'express';
import { StatusCodes } from 'http-status-codes';

import { COOKIE_NAME } from '@/lib/cookies';

const router = express.Router();

router.get('/is-authed', async (req, res) => {
  const authToken: string | undefined = req.cookies[COOKIE_NAME];
  // if (authToken && isCookieValid(authToken)) {
  //   return res.status(StatusCodes.OK);
  // }
  return res.status(StatusCodes.UNAUTHORIZED);
});

export default router;
