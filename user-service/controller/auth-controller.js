import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail as _findUserByEmail } from '../model/repository.js';
import { findUserById as _findUserById } from '../model/repository.js';
import { formatUserResponse } from './user-controller.js';

export async function handleLogin(req, res) {
  const { email, password } = req.body;

  if (email && password) {
    try {
      const user = await _findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Wrong email and/or password' });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: 'Wrong email and/or password' });
      }

      const accessToken = jwt.sign(
        {
          id: user.id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '5d',
        },
      );

      return res.status(200).json({
        message: 'User logged in',
        data: { accessToken, ...formatUserResponse(user) },
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(400).json({ message: 'Missing email and/or password' });
  }
}

export async function handleVerifyToken(req, res) {
  try {
    const verifiedUser = req.user;

    return res
      .status(200)
      .json({ message: 'Token verified', data: verifiedUser });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

/**
 * Controller function to verify if the password is correct
 * @param {} req
 * @param {*} res
 * @returns 200 if password is correct, 400 if missing id and/or password, 401 if user not found, 500 if error
 */
export async function verifyPassword(req, res) {
  const { id } = req.params;
  const { password } = req.body;
  const verifiedUser = req.user;

  if (!id) {
    return res.status(400).json({ message: 'Missing id' });
  }

  if (!password) {
    return res.status(400).json({ message: 'Missing password' });
  }

  // Only the owner of the account can verify the password
  if (id !== verifiedUser.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Getting the password from the database
  const user = await _findUserById(id);

  try {
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Wrong password' });
    }

    return res.status(200).json({ message: 'Password verified' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
