import { db } from '../../lib/db/index';
import { and, arrayOverlaps, eq, ilike, notInArray, sql } from 'drizzle-orm';
import { questions } from '../../lib/db/schema';
import {
  IGetQuestionsPayload,
  IGetQuestionsResponse,
  IGetQuestionPayload,
  IGetQuestionResponse,
  IGetRandomQuestionPayload,
  IGetRandomQuestionResponse,
} from '../get/types';

export const getQuestionsService = async (
  payload: IGetQuestionsPayload
): Promise<IGetQuestionsResponse> => {
  const { questionName, difficulty, topic, pageNum = 0, recordsPerPage = 20 } = payload;
  const offset = pageNum * recordsPerPage;

  const whereClause = [];

  if (questionName) {
    whereClause.push(ilike(questions.title, `%${questionName}%`));
  }
  if (difficulty) {
    whereClause.push(eq(questions.difficulty, difficulty));
  }
  if (topic && topic.length > 0) {
    whereClause.push(arrayOverlaps(questions.topic, topic));
  }

  const query = db
    .select()
    .from(questions)
    .where(and(...whereClause))
    .limit(recordsPerPage)
    .offset(offset);

  const [results, totalCount] = await Promise.all([
    query,
    db
      .select({ count: questions.id })
      .from(questions)
      .where(and(...whereClause))
      .then((res) => res.length),
  ]);

  return {
    code: 200,
    data: {
      questions: results.map((q) => ({
        id: q.id,
        title: q.title,
        difficulty: q.difficulty,
        topic: q.topic,
      })),
      totalQuestions: totalCount,
    },
  };
};

export const getQuestionDetailsService = async (
  payload: IGetQuestionPayload
): Promise<IGetQuestionResponse> => {
  const { questionId } = payload;

  const result = await db
    .select()
    .from(questions)
    .where(sql`${questions.id} = ${questionId}`)
    .limit(1);

  if (result.length === 0) {
    return {
      code: 404,
      data: { question: null },
      error: {
        message: 'Question not found',
      },
    };
  }

  return {
    code: 200,
    data: { question: result[0] },
  };
};

export const getRandomQuestionService = async (
  payload: IGetRandomQuestionPayload
): Promise<IGetRandomQuestionResponse> => {
  const { attemptedQuestions, difficulty, topic } = payload;
  const whereClause = [];

  if (difficulty) {
    whereClause.push(eq(questions.difficulty, difficulty));
  }

  if (topic && topic.length > 0) {
    whereClause.push(arrayOverlaps(questions.topic, topic));
  }

  if (attemptedQuestions && attemptedQuestions.length > 0) {
    whereClause.push(notInArray(questions.id, attemptedQuestions));
  }

  // randomize the order of questions
  const query = db
    .select()
    .from(questions)
    .where(and(...whereClause))
    .orderBy(sql`RANDOM()`)
    .limit(1);

  const result = await query;

  if (result.length === 0) {
    return {
      code: 404,
      data: { question: null },
      error: {
        message: 'No matching questions found',
      },
    };
  }

  return {
    code: 200,
    data: { question: result[0] },
  };
};

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
