import { z } from 'zod';
import { ObjectId } from 'mongodb';

// object id schema
const objectIdSchema = z.instanceof(ObjectId);

export const QuestionsSchema = z.object({
  _id: objectIdSchema,
  difficulty: z.number(),
  description: z.string(),
  examples: z.array(z.string()),
  constraints: z.string(),
  tags: z.array(z.string()),
  title_slug: z.string(),
  title: z.string(),
  pictures: z.array(z.instanceof(File)).optional(),
});

export const UserQuestionsSchema = z.object({
  _id: objectIdSchema,
  _user_id: objectIdSchema,
  _question_id: objectIdSchema,
  status: z.enum(['completed', 'in-progress', 'not-started']),
});
