import { JWT_SECRET_KEY } from '@/config';
import jwt from 'jsonwebtoken';

export const generateCookie = <T extends object>(payload: T) => {
  return jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: '30m',
  });
};

export const isCookieValid = (cookie: string) => {
  return jwt.verify(cookie, JWT_SECRET_KEY, {
    ignoreExpiration: false,
  });
};

export const decodeCookie = (cookie: string) => {
  return jwt.decode(cookie);
};

// TODO: Insert proper cookie validity logic and middleware
export const isAuthed = <T extends object>(cookie: string, payload: T) => {
  if (!isCookieValid(cookie) || decodeCookie(cookie) !== payload) {
    return false;
  }
  return true;
};
