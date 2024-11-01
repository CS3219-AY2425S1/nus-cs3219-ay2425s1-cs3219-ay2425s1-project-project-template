import { collabApiClient } from './api-clients';

const AI_SERVICE_ROUTES = {
  CHAT: '/ai/chat',
};

interface IChatResponse {
  success: boolean;
  message: string;
  response?: string;
}

export const sendChatMessage = (
  messages: Array<{ role: string; content: string }>
): Promise<IChatResponse> => {
  return collabApiClient
    .post(AI_SERVICE_ROUTES.CHAT, { messages })
    .then((res) => {
      return res.data as IChatResponse;
    })
    .catch((err) => {
      console.error(err);
      return {
        success: false,
        message: 'An error occurred while processing your request.',
      } as IChatResponse;
    });
};
