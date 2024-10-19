import axios from 'axios';

import { PEERPREP_USER_HOST } from '@/config';

export async function fetchAttemptedQuestions(userId: string): Promise<number[]> {
  const response = await axios.post<number[]>(
    `${PEERPREP_USER_HOST}/user/attempted-question/get`,
    {userId}
  );
  if (response.status !== 200 || !response.data) {
    throw new Error(`Failed to fetch attempted questions for user ${userId}`);
  }
  return response.data || [];
}

export async function updateAttemptedQuestions(userIds: string[], questionId: number): Promise<void> {
  const response = await axios.post<unknown>(
    `${PEERPREP_USER_HOST}/user/attempted-question/add`,
    { questionId, userIds }
  );
  if (response.status !== 200 || !response.data) {
    throw new Error(`Failed to update attempted questions for users ${userIds}`);
  }
  return;
}