import { Request, Response } from 'express';
import { LoginCredentials } from './types/auth-types';
import { db, users } from '../../lib/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function login(req: Request, res: Response) {
  const { username, password }: LoginCredentials = req.body;
  const userArray = await db.select().from(users).where(eq(users.username, username));
  if (userArray.length === 0) {
    return res.status(404).json('Account does not exist');
  }

  const user = userArray[0];
  const checkPassword = bcrypt.compareSync(password, user.password);
  if (!checkPassword) {
    return res.status(401).json('Incorrect Password');
  }

  const { password: _userPassword, ...userDetails } = user;
  const jwtToken = jwt.sign({ id: user.id }, 'key');
  return res.cookie('jwtToken', jwtToken, { httpOnly: true }).status(200).json(userDetails);
}

export async function logout(_req: Request, res: Response) {
  return res
    .clearCookie('jwtToken', {
      secure: true,
      sameSite: 'none',
    })
    .status(200)
    .json('User has been logged out.');
}
