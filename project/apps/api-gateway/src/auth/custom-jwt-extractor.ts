import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';

export const CustomJwtExtractor: (req: Request) => string | null = (
  req: Request,
) => {
  // 1. Try to extract token from Authorization header
  const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

  if (token) {
    return token;
  }

  // 2. If not found in header, try to extract from cookies
  if (req.cookies && req.cookies['token']) {
    return req.cookies['token'];
  }

  // 3. Token not found
  return null;
};
