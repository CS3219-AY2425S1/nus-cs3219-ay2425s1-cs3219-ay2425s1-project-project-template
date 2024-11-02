import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const createSystemMessage = (
  editorCode?: string,
  language?: string,
  questionDetails?: any
): OpenAIMessage => ({
  role: 'system',
  content: `You are a helpful coding assistant. 
You are helping a user with a coding problem.
${questionDetails ? `\nQuestion Context:\n${JSON.stringify(questionDetails, null, 2)}` : ''}
${editorCode ? `\nCurrent Code (${language || 'unknown'}):\n${editorCode}` : ''}
Provide detailed help while referring to their specific code and question context when available.`,
});

export async function queryOpenAI(req: Request, res: Response) {
  const { messages, editorCode, language, questionDetails } = req.body;
  const isStreaming = req.headers['accept'] === 'text/event-stream';

  if (!messages || !Array.isArray(messages)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Invalid request: messages array is required.',
    });
  }

  try {
    const systemMessage = createSystemMessage(editorCode, language, questionDetails);
    const allMessages = [systemMessage, ...messages];

    if (isStreaming) {
      // Set up streaming response headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Create streaming completion
      const stream = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: allMessages,
        stream: true,
      });

      // Handle streaming response
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';

        if (content) {
          // Send the chunk in SSE format
          res.write(`data: ${content}\n\n`);
        }
      }

      // End the response
      res.end();
    } else {
      // Non-streaming response
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: allMessages,
      });

      const responseMessage = completion.choices[0]?.message?.content;

      if (!responseMessage) {
        throw new Error('No valid response from OpenAI');
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        message: responseMessage,
      });
    }
  } catch (err) {
    console.error('OpenAI API Error:', err);

    // If headers haven't been sent yet, send error response
    if (!res.headersSent) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'An error occurred while querying OpenAI',
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    } else {
      // If we were streaming, end the response
      res.end();
    }
  }

  // Handle client disconnection
  req.on('close', () => {
    if (isStreaming && !res.writableEnded) {
      res.end();
    }
  });
}
