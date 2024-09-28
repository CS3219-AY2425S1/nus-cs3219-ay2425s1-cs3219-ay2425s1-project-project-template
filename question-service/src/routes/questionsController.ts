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

// Update a question
router.put('/:questionId', async (req: Request, res: Response) => {
  const { questionId } = req.params;
  const updatedQuestion: Questions = req.body;

  try {
    if (!updatedQuestion || typeof updatedQuestion !== 'object') {
      return res.status(400).json({ error: 'Invalid question data.' });
    }

    const result = await questionsCollection.updateOne(
      { _question_id: Number(questionId) },
      { $set: updatedQuestion }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    res.status(200).json({ message: 'Question updated successfully' });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'Failed to update question' });
  }
});

// POST a new question
router.post('/', async (req: Request, res: Response) => {
  try {
    const newQuestion: Questions = req.body; // Assume the body contains a question object
    
    const { _question_id, difficulty, description, examples, constraints, tags, title_slug, title, pictures } = newQuestion;

    if (
      typeof _question_id !== 'number' ||
      typeof difficulty !== 'number' ||
      typeof description !== 'string' ||
      !Array.isArray(examples) ||
      typeof constraints !== 'string' ||
      !Array.isArray(tags) ||
      typeof title_slug !== 'string' ||
      typeof title !== 'string'
    ) {
      return res.status(400).json({ error: 'Invalid question data. Please check your input.' });
    }

    const result = await questionsCollection.insertOne(newQuestion);

    res.status(201).json({ message: 'Question inserted successfully', questionId: result.insertedId });
  } catch (error) {
    console.error('Error inserting question:', error);
    res.status(500).json({ error: 'Failed to insert question' });
  }
});

// DELETE a question
router.delete('/:questionId', async (req: Request, res: Response) => {
  const { questionId } = req.params;

  try {
    const result = await questionsCollection.deleteOne({ _question_id: Number(questionId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

export default router;
