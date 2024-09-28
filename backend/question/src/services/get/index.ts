import { db } from '../../lib/db/index';
import { sql } from 'drizzle-orm';
import { questions } from '../../lib/db/schema';
import { IGetQuestionsResponse } from '../get/types';

export const searchQuestionsByTitleService = async (
  title: string,
  page: number,
  limit: number
): Promise<IGetQuestionsResponse> => {
  const searchPattern = `%${title}%`;
  const effectivePage = page ?? 1;
  const effectiveLimit = limit ?? 10;
  const offset = (effectivePage - 1) * effectiveLimit;

  // Query the database for questions matching the title
  const results = await db
    .select({
      id: questions.id,
      title: questions.title,
      difficulty: questions.difficulty,
      topic: questions.topic,
    })
    .from(questions)
    .where(sql`${questions.title} ILIKE ${searchPattern}`) // Use ILIKE for case-insensitive matching
    .limit(effectiveLimit)
    .offset(offset);

  // Return the results as per IGetQuestionsResponse format
  return {
    code: 200,
    data: {
      questions: results, // Directly returning the query results
      totalQuestions: results.length, // Count of questions returned
    },
  };
};
