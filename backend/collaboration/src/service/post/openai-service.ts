import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function getOpenAIResponse(messages: OpenAIMessage[]) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // or the desired model
      messages: [
        {
          role: 'system',
          content:
            `You are a helpful coding assistant. ` +
            `You are helping a user with a coding problem. ` +
            `Provide tips to the user on solving the problem ` +
            `but do NOT provide the solution directly.`,
        },
        ...messages,
      ],
    });

    if (response.choices && response.choices[0].message) {
      return {
        success: true,
        message: response.choices[0].message.content,
      };
    } else {
      throw new Error('No valid response from OpenAI');
    }
  } catch (error) {
    throw new Error((error as Error)?.message || 'Failed to query OpenAI');
  }
}
