import { db } from '../../lib/db/index';
import { sql } from 'drizzle-orm';
import { questions } from '../../lib/db/schema';
import { IGetQuestionsResponse } from '../get/types';

export const searchQuestionsByTitleService = async (
  title: string
): Promise<IGetQuestionsResponse> => {
  const searchPattern = `%${title}%`;

  // Query the database for questions matching the title
  const results = await db
    .select({
      id: questions.id,
      title: questions.title,
      difficulty: questions.difficulty,
      topic: questions.topic,
      attempted: questions.attempted,
    })
    .from(questions)
    .where(sql`${questions.title} ILIKE ${searchPattern}`); // Use ILIKE for case-insensitive matching

  // Return the results as per IGetQuestionsResponse format
  return {
    code: 200,
    data: {
      questions: results, // Directly returning the query results
      totalQuestions: results.length, // Count of questions returned
    },
  };
};
