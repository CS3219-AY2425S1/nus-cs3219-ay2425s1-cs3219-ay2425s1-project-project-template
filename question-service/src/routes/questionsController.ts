// src/routes/items.ts
import express, { Request, Response } from 'express';
import { Collection } from 'mongodb';
import { connectToDB } from '../db/mongoClient';
import { Questions } from '../models/types';

const router = express.Router();
let questionsCollection: Collection<Questions>;

// Middleware to connect to MongoDB and get the collection
router.use(async (_, res, next) => {
  try {
    const db = await connectToDB();
    questionsCollection = db.collection<Questions>('questions');
    next();
  } catch (err) {
    res.status(500).json({ error: `Failed to connect to MongoDB, ${err}` });
  }
});

// GET all items
router.get('/', async (req: Request, res: Response) => {
  try {
    const items = await questionsCollection.find().toArray();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

export default router;
