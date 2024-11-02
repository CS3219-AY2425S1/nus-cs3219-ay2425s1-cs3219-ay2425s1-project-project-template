import { EventEmitter } from 'events';

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIRequest {
  messages: OpenAIMessage[];
  editorCode?: string;
  language?: string;
  questionDetails?: string;
}

// Helper to create system message with context
const createSystemMessage = (editorCode?: string, language?: string, questionDetails?: string) => {
  return {
    role: 'system' as const,
    content: `You are a helpful coding assistant. 
You are helping a user with a coding problem.
${questionDetails ? `\nQuestion Context:\n${JSON.stringify(questionDetails, null, 2)}` : ''}
${editorCode ? `\nCurrent Code (${language || 'unknown'}):\n${editorCode}` : ''}
Provide detailed help while referring to their specific code and question context when available.`,
  };
};

// Regular response function
export async function getOpenAIResponse(request: OpenAIRequest) {
  const { messages, editorCode, language, questionDetails } = request;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [createSystemMessage(editorCode, language, questionDetails), ...messages],
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

// Streaming response function
export async function getOpenAIStreamResponse(request: OpenAIRequest): Promise<EventEmitter> {
  const { messages, editorCode, language, questionDetails } = request;
  const stream = new EventEmitter();

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [createSystemMessage(editorCode, language, questionDetails), ...messages],
      stream: true,
    });

    // Process the streaming response
    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content || '';

      if (content) {
        stream.emit('data', content);
      }
    }

    stream.emit('end');
  } catch (error) {
    stream.emit('error', error);
  }

  return stream;
}
