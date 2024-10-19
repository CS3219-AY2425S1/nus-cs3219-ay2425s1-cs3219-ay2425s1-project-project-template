import { IMatchType } from "@/types";
import axios from 'axios';

interface IGetRandomQuestionPayload {
  attemptedQuestions: number[];
  difficulty?: string;
  topic?: string;
}


interface IServiceResponse<T> {
    success: boolean;
    data?: T;
    error?: { message: string };
  }

interface IQuestion {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  topic: string[];
}

interface IMatchItemsResponse {
    roomName: string;
    questionId: number;
    question: IQuestion;
}

export const getMatchItems = async (
    searchIdentifier: IMatchType,
    topic?: string,
    difficulty?: string,
    userId1?: string,
    userId2?: string
): Promise<IMatchItemsResponse | undefined> => {
  const userEndpoint = `${process.env.USER_SERVER_ENDPOINT}`;
  const questionEndpoint = `${process.env.QUESTION_SERVER_ENDPOINT}`;
  const collabServerEndpoint = `${process.env.COLLAB_SERVER_ENDPOINT}`;

  try {
    if (!userId1 || !userId2) {
      throw new Error('Both user IDs are required');
    }

    // Fetch attempted questions for both users
    const [attemptedQuestions1, attemptedQuestions2] = await Promise.all([
      fetchAttemptedQuestions(userEndpoint, userId1),
      fetchAttemptedQuestions(userEndpoint, userId2)
    ]);

    // Combine attempted questions from both users
    const allAttemptedQuestions = [...new Set([...attemptedQuestions1, ...attemptedQuestions2])];

    // Prepare payload for the /random endpoint
    const payload: IGetRandomQuestionPayload = {
      attemptedQuestions: allAttemptedQuestions,
    };

    if (searchIdentifier === 'difficulty' && difficulty) {
      payload.difficulty = difficulty;
    } else if (searchIdentifier === 'topic' && topic) {
      payload.topic = topic;
    } else if (searchIdentifier === 'exact match' && topic && difficulty) {
      payload.topic = topic;
      payload.difficulty = difficulty;
    }

    // Query the question endpoint using the /random endpoint
    const questionResponse = await axios.post<IServiceResponse<{ question: IQuestion }>>(
      `${questionEndpoint}/questions/random`,
      payload
    );

    if (questionResponse.status !== 200 || !questionResponse.data.data) {
      throw new Error(questionResponse.data.error?.message || 'Failed to get a random question');
    }

    const questionId = questionResponse.data.data.question.id;

    // Update attempted questions for both users
    await Promise.all([
      updateAttemptedQuestions(userEndpoint, userId1, questionId),
      updateAttemptedQuestions(userEndpoint, userId2, questionId)
    ]);

    // Query the collab server for the room ID
    const roomResponse = await axios.get<{ roomName: string }>(
      `${collabServerEndpoint}/room`,
      {
        params: {
          userid1: userId1,
          userid2: userId2,
          questionid: questionId.toString(),
        }
      }
    );    
    if (roomResponse.status !== 200 || !roomResponse.data?.roomName) {
      throw new Error('Failed to create room');
    }

    console.log("Succesfully got match items");
    return {
        roomName: roomResponse.data.roomName,
        questionId: questionId,
        question: questionResponse.data.data.question,
      }
  } catch (error) {
    console.error('Error in getMatchItems:', error);
};
}

async function fetchAttemptedQuestions(userEndpoint: string, userId: string): Promise<number[]> {
  const response = await axios.get<number[]>(
    `${userEndpoint}/user/${userId}/attempted-questions`
  );
  if (response.status !== 200 || !response.data) {
    throw new Error(`Failed to fetch attempted questions for user ${userId}`);
  }
  return response.data || []
}

async function updateAttemptedQuestions(userEndpoint: string, userId: string, questionId: number): Promise<void> {
  const response = await axios.post<unknown>(
    `${userEndpoint}/user/${userId}/attempt-question`,
    { questionId }
  );
  if (response.status !== 200 || !response.data) {
    throw new Error(`Failed to fetch attempted questions for user ${userId}`);
  }
    return;
}