import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '../utils/logging.js'; // Import the logger
import { findUserByEmail as _findUserByEmail } from '../model/repository.js';
import { formatUserResponse } from './user-controller.js';

export async function handleLogin(req, res) {
  const { email, password } = req.body;

  logger.info(`Login attempt for email: ${email}`);

  if (email && password) {
    try {
      const user = await _findUserByEmail(email);
      if (!user) {
        logger.warn(`Login failed - User not found for email: ${email}`);
        return res.status(401).json({ message: 'Wrong email and/or password' });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        logger.warn(`Login failed - Incorrect password for email: ${email}`);
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

      logger.info(
        `Login successful for email: ${email}, AccessToken generated`,
      );

      return res.status(200).json({
        message: 'User logged in',
        data: { accessToken, ...formatUserResponse(user) },
      });
    } catch (err) {
      logger.error(`Login error for email: ${email} - ${err.message}`);
      return res.status(500).json({ message: err.message });
    }
  } else {
    logger.warn('Login attempt with missing email or password');
    return res.status(400).json({ message: 'Missing email and/or password' });
  }
}

export async function handleVerifyToken(req, res) {
  try {
    const verifiedUser = req.user;
    logger.info(
      `Token verification successful for user ID: ${verifiedUser.id}`,
    );
    return res
      .status(200)
      .json({ message: 'Token verified', data: verifiedUser });
  } catch (err) {
    logger.error(`Token verification error - ${err.message}`);
    return res.status(500).json({ message: err.message });
  }
}
