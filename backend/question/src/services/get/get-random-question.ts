import {
  and,
  arrayOverlaps,
  asc,
  eq,
  getTableColumns,
  inArray,
  isNull,
  or,
  sql,
} from 'drizzle-orm';

import { db } from '@/lib/db/index';
import {
  questionAttempts as QUESTION_ATTEMPTS_TABLE,
  questions as QUESTIONS_TABLE,
} from '@/lib/db/schema';
import { logger } from '@/lib/utils';

/**
 * Both userIds specified (they are matches after all)
 * 1.1. Both Unattempted
 *
 * SELECT q.*
 * FROM
 *   questions q
 * LEFT JOIN
 *   question_attempts qa
 * ON
 *   q.id = qa.question_id
 *   AND (
 *     qa.user_id_1 IN (userId1, userId2)
 *     OR qa.user_id_2 IN (userId1, userId2)
 *   )
 * WHERE
 *   qa.question_id IS NULL
 *   AND q.topic && topic
 *   AND q.difficulty = difficulty
 * ORDER BY RANDOM()
 * LIMIT 1;
 *
 * 1.2.
 *   - Get topic/difficulty for both
 *   - Pick one with least attempts
 * WITH "at" AS (
 *   SELECT
 *     q.*,
 *     SUM(
 *       CASE WHEN
 *         qa.user_id_1 = $userId1
 *         OR qa.user_id_2 = $userId1 THEN 1 END
 *     ) AS user1_attempts,
 *     SUM(
 *       CASE WHEN
 *         qa.user_id_1 = $userId2
 *         OR qa.user_id_2 = $userId2 THEN 1 END
 *     ) AS user2_attempts
 *   FROM
 *     questions q
 *     JOIN question_attempts qa ON q.id = qa.question_id
 *     AND (
 *       qa.user_id_1 IN ($userId1, $userId2)
 *       OR qa.user_id_2 IN ($userId1, $userId2)
 *     )
 *   WHERE
 *     q.topic::text[] && $topic
 *     AND q.difficulty = $difficulty
 *   GROUP BY
 *     q.id
 * )
 * SELECT
 *   *
 * FROM
 *   "at"
 * ORDER BY
 *   (
 *     COALESCE("at".user1_attempts, 0) + COALESCE("at".user2_attempts, 0)
 *   ) ASC
 * LIMIT 1
 */

type Params = {
  userId1: string;
  userId2: string;
  topics?: Array<string>;
  difficulty?: string;
};

// Fetch an unattempted question or fallback to the least attempted one
export const getRandomQuestion = async ({ userId1, userId2, topics, difficulty }: Params) => {
  /**
   * 1. Both Unattempted
   */
  // If an attempt contains either user's ID
  const ids = [userId1, userId2];
  const userIdClause = [
    inArray(QUESTION_ATTEMPTS_TABLE.userId1, ids),
    inArray(QUESTION_ATTEMPTS_TABLE.userId2, ids),
  ];
  // Join both tables on qId equality, filtering only rows with either user's ID
  const joinClause = [
    eq(QUESTIONS_TABLE.id, QUESTION_ATTEMPTS_TABLE.questionId),
    or(...userIdClause),
  ];

  // Build the filter clause
  // - attempt ID null: No attempts
  // - topics: If specified, must intersect using Array Intersect
  const filterClause = [];

  if (topics) {
    filterClause.push(arrayOverlaps(QUESTIONS_TABLE.topic, topics));
  }

  if (difficulty) {
    filterClause.push(eq(QUESTIONS_TABLE.difficulty, difficulty));
  }

  const bothUnattempted = await db
    .select({ question: QUESTIONS_TABLE })
    .from(QUESTIONS_TABLE)
    .leftJoin(QUESTION_ATTEMPTS_TABLE, and(...joinClause))
    .where(and(isNull(QUESTION_ATTEMPTS_TABLE.attemptId), ...filterClause))
    .orderBy(sql`RANDOM()`)
    .limit(1);

  if (bothUnattempted && bothUnattempted.length > 0) {
    return bothUnattempted[0].question;
  }

  // 2. At least one user has attempted.
  // - Fetch all questions, summing attempts by both users, ranking and selecting the lowest count.
  const attempts = db.$with('at').as(
    db
      .select({
        ...getTableColumns(QUESTIONS_TABLE),
        user1Count:
          sql`SUM(CASE WHEN ${QUESTION_ATTEMPTS_TABLE.userId1} = ${userId1}::uuid OR ${QUESTION_ATTEMPTS_TABLE.userId2} = ${userId1}::uuid THEN 1 END)`.as(
            'user1_attempts'
          ),
        user2Count:
          sql`SUM(CASE WHEN ${QUESTION_ATTEMPTS_TABLE.userId1} = ${userId2}::uuid OR ${QUESTION_ATTEMPTS_TABLE.userId2} = ${userId2}::uuid THEN 1 END)`.as(
            'user2_attempts'
          ),
      })
      .from(QUESTIONS_TABLE)
      .innerJoin(QUESTION_ATTEMPTS_TABLE, and(...joinClause))
      .where(and(...filterClause))
      .groupBy(QUESTIONS_TABLE.id)
  );
  const result = await db
    .with(attempts)
    .select()
    .from(attempts)
    .orderBy(asc(sql`COALESCE(user1_attempts,0) + COALESCE(user2_attempts,0)`))
    .limit(1);

  if (result && result.length > 0) {
    return { ...result[0], user1Count: undefined, user2Count: undefined };
  }

  // This branch should not be reached
  logger.info('Unreachable Branch - If first query fails, second query must return something');
};
