import express from 'express';
import cookieParser from 'cookie-parser';
import { COOKIE_NAME, isCookieValid } from '@/lib/cookies';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();
router.use(cookieParser());

router.get('/is-authed', async (req, res) => {
  const authToken = req.cookies[COOKIE_NAME];
  if (authToken && isCookieValid(authToken)) {
    return res.status(StatusCodes.OK);
  }
  return res.status(StatusCodes.UNAUTHORIZED);
});

export default router;
