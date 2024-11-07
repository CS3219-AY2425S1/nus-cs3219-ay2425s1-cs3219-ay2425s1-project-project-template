import { Request, Response } from 'express';
import logger from '../../utils/logger';
import User from '../../models/user';

const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    logger.error('User ID required');
    return res.status(400).json({ message: 'User ID required' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      logger.error('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error: any) {
    logger.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { getUserById };