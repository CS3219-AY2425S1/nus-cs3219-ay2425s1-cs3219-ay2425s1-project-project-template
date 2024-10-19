import axios from 'axios';
import { IServiceResponse, IQuestion, IGetRandomQuestionPayload } from '../types/index';

const questionEndpoint = `${process.env.QUESTION_SERVER_ENDPOINT}`;

export async function getRandomQuestion(payload: IGetRandomQuestionPayload): Promise<IQuestion> {
  const response = await axios.post<IServiceResponse<{ question: IQuestion }>>(
    `${questionEndpoint}/questions/random`,
    payload
  );

  if (response.status !== 200 || !response.data.data) {
    throw new Error(response.data.error?.message || 'Failed to get a random question');
  }

  return response.data.data.question;
}