import axios from 'axios';

const userEndpoint = `${process.env.USER_SERVER_ENDPOINT}`;

export async function fetchAttemptedQuestions(userId: string): Promise<number[]> {
  const response = await axios.post<number[]>(
    `${userEndpoint}/user/attempted-question/get`,
    {userId}
  );
  if (response.status !== 200 || !response.data) {
    throw new Error(`Failed to fetch attempted questions for user ${userId}`);
  }
  return response.data || [];
}

export async function updateAttemptedQuestions(userIds: string[], questionId: number): Promise<void> {
  const response = await axios.post<unknown>(
    `${userEndpoint}/user/attempted-question/add`,
    { questionId, userIds }
  );
  if (response.status !== 200 || !response.data) {
    throw new Error(`Failed to update attempted questions for users ${userIds}`);
  }
  return;
}