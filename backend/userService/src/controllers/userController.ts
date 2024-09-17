import { Request, Response } from 'express';
import User from '../models/userModel';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      console.error('Failed to get users', error);
      res.status(500).json({ message: 'Failed to get users' });
    }
  };

export const createUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    try {
      const newUser = new User({ name, email, password });
      await newUser.save();
      res.status(201).json({ message: 'User created', user: newUser });
    } catch (error) {
      console.error('Failed to create user', error);
      res.status(500).json({ message: 'Failed to create user' });
    }
};
