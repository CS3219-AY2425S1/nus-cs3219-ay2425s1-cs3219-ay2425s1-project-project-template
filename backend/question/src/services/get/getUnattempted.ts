// src/services/questionsService.js
import { and, eq, or, sql } from 'drizzle-orm';

import { db } from '@/lib/db/index';
import { questionAttempts, questions } from '@/lib/db/schema';

// Fetch an unattempted question or fallback to the least attempted one

export const getUnattemptedOrLeastAttemptedQuestion = async (
  userId1: number,
  userId2?: number,
  topics?: string[],
  difficulty?: string
) => {
  // Convert topics to varchar[] format if provided
  const topicsArray = topics && topics.length > 0 ? topics : [];

  if (userId2) {
    const unattemptedQueryBoth = await db
      .select()
      .from(questions)
      .leftJoin(
        questionAttempts,
        and(
          eq(questions.id, questionAttempts.questionId),
          or(
            eq(questionAttempts.userId1, userId1),
            eq(questionAttempts.userId2, userId1),
            eq(questionAttempts.userId1, userId2),
            eq(questionAttempts.userId2, userId2)
          )
        )
      )
      .where(
        and(
          // Ensure the question has not been attempted by either userId1 or userId2
          sql`${questionAttempts.questionId} IS NULL`,

          // Apply topics filter if provided
          topicsArray.length > 0
            ? sql`${questions.topic} && ARRAY[${topicsArray.map((topic) => sql`${topic}`)}]::varchar[]`
            : sql`true`,

          // Filter by difficulty if provided
          difficulty ? eq(questions.difficulty, difficulty) : sql`true`
        )
      )
      .orderBy(sql`RANDOM()`)
      .limit(1);

    // If unattempted questions for both users are found, return the first result
    if (unattemptedQueryBoth.length > 0) {
      return unattemptedQueryBoth[0];
    }
  }

  // try to find unattempted questions for userId1
  const unattemptedQueryUser1 = await db
    .select()
    .from(questions)
    .leftJoin(
      questionAttempts,
      and(
        eq(questions.id, questionAttempts.questionId),
        or(eq(questionAttempts.userId1, userId1), eq(questionAttempts.userId2, userId1))
      )
    )
    .where(
      and(
        // Ensure the question has not been attempted by userId1
        sql`${questionAttempts.questionId} IS NULL`,

        // Apply topics filter
        topicsArray.length > 0
          ? sql`${questions.topic} && ARRAY[${topicsArray.map((topic) => sql`${topic}`)}]::varchar[]`
          : sql`true`, // Skip topics filter if topicsArray is empty

        // Filter by difficulty if provided
        difficulty ? eq(questions.difficulty, difficulty) : sql`true`
      )
    )
    .orderBy(sql`RANDOM()`)
    .limit(1);

  // If unattempted questions are found for userId1, return the first result
  if (unattemptedQueryUser1.length > 0) {
    return unattemptedQueryUser1[0];
  }

  // If no unattempted questions are found for userId1, check for userId2
  if (userId2) {
    const unattemptedQueryUser2 = await db
      .select()
      .from(questions)
      .leftJoin(
        questionAttempts,
        and(
          eq(questions.id, questionAttempts.questionId),
          or(eq(questionAttempts.userId1, userId2), eq(questionAttempts.userId2, userId2))
        )
      )
      .where(
        and(
          // Ensure the question has not been attempted by userId2
          sql`${questionAttempts.questionId} IS NULL`,
          // Apply topics filter
          topicsArray.length > 0
            ? sql`${questions.topic} && ARRAY[${topicsArray.map((topic) => sql`${topic}`)}]::varchar[]`
            : sql`true`,
          // Filter by difficulty if provided
          difficulty ? eq(questions.difficulty, difficulty) : sql`true`
        )
      )
      .orderBy(sql`RANDOM()`)
      .limit(1);

    // If unattempted questions are found for userId2, return the first result
    if (unattemptedQueryUser2.length > 0) {
      return unattemptedQueryUser2[0];
    }
  }

  // If no unattempted questions are found, find the least attempted question
  const leastAttemptedUser1 = await db
    .select({
      id: questions.id,
      title: questions.title,
      difficulty: questions.difficulty,
      topic: sql`ARRAY_AGG(${questions.topic}) AS topic`,
      description: questions.description,
      createdAt: questions.createdAt,
      updatedAt: questions.updatedAt,
      attemptCount: sql`COUNT(${questionAttempts.questionId})`, // Count attempts for userId1
    })
    .from(questions)
    .leftJoin(questionAttempts, eq(questions.id, questionAttempts.questionId))
    .where(
      and(
        // Ensure the question has not been attempted by userId1
        or(eq(questionAttempts.userId1, userId1), eq(questionAttempts.userId2, userId1)),
        // Apply topics filter
        topicsArray.length > 0
          ? sql`${questions.topic} && ARRAY[${topicsArray.map((topic) => sql`${topic}`)}]::varchar[]`
          : sql`true`,
        // Filter by difficulty if provided
        difficulty ? eq(questions.difficulty, difficulty) : sql`true`
      )
    )
    .groupBy(
      questions.id,
      questions.title,
      questions.difficulty,
      questions.topic,
      questions.description,
      questions.createdAt,
      questions.updatedAt // Group by all selected fields
    )
    .orderBy(sql`COUNT(${questionAttempts.questionId}) ASC`) // Order by the count of attempts (least attempted first)
    .limit(1);

  // Now find the least attempted question for userId2 if provided
  const leastAttemptedUser2 = userId2
    ? await db
        .select({
          id: questions.id,
          title: questions.title,
          difficulty: questions.difficulty,
          topic: sql`ARRAY_AGG(${questions.topic}) AS topic`,
          description: questions.description,
          createdAt: questions.createdAt,
          updatedAt: questions.updatedAt,
          attemptCount: sql`COUNT(${questionAttempts.questionId})`, // Count attempts for userId2
        })
        .from(questions)
        .leftJoin(questionAttempts, eq(questions.id, questionAttempts.questionId))
        .where(
          and(
            // Ensure the question has not been attempted by userId2
            or(eq(questionAttempts.userId1, userId2), eq(questionAttempts.userId2, userId2)),
            // Apply topics filter
            topicsArray.length > 0
              ? sql`${questions.topic} && ARRAY[${topicsArray.map((topic) => sql`${topic}`)}]::varchar[]`
              : sql`true`,
            // Filter by difficulty if provided
            difficulty ? eq(questions.difficulty, difficulty) : sql`true`
          )
        )
        .groupBy(
          questions.id,
          questions.title,
          questions.difficulty,
          questions.topic,
          questions.description,
          questions.createdAt,
          questions.updatedAt
        )
        .orderBy(sql`COUNT(${questionAttempts.questionId}) ASC`) // Order by the count of attempts (least attempted first)
        .limit(1)
    : null;

  // Determine which question to return based on attempts
  const finalResults = [
    leastAttemptedUser1[0],
    leastAttemptedUser2 ? leastAttemptedUser2[0] : null,
  ].filter(Boolean);

  // Check if finalResults has at least one valid question
  if (finalResults.length > 0) {
    return finalResults.reduce((prev, curr) => {
      // Check if prev is null, in which case return curr
      if (!prev) return curr; // If prev is null, return curr
      // Check if curr is null, in which case return prev
      if (!curr) return prev; // If curr is null, return prev

      // If both are valid, compare their attempt counts
      const prevCount = prev.attemptCount || 0;
      const currCount = curr.attemptCount || 0;

      return prevCount < currCount ? prev : curr; // Return the one with fewer attempts
    });
  }
};
