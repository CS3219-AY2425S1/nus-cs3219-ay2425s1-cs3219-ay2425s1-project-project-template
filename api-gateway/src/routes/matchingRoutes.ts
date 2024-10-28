import express from 'express';
import WebSocket from 'ws';
import config from '../config';
import { sendMessageToQueue, consumeMessageFromQueue } from '../utils/rabbitmq';
import { UserMatchingRequest, UserMatchingResponse } from '../types/types';
import logger from '../utils/logger';
import { Client } from '@stomp/stompjs';

const router = express.Router();

// HTTP POST endpoint for sending messages to queue
router.post('/send', async (req, res) => {
  try {
    const matchingRequest: UserMatchingRequest = req.body;
    await sendMessageToQueue(matchingRequest);
    res.status(200).json({ message: 'Match request sent successfully' });
  } catch (error) {
    console.error('Error in matching route:', error);
    res.status(500).json({ error: 'Failed to process matching request' });
  }
});

// WebSocket server for handling real-time communication
const wsServer = new WebSocket.Server({ noServer: true });

wsServer.on('connection', (ws, request) => {
  try {
    // Get userId from query parameters
    const userId = new URL(
      request.url!,
      `http://${request.headers.host}`,
    ).searchParams.get('userId');

    if (!userId) {
      logger.error('No userId provided in WebSocket connection');
      ws.close();
      return;
    }

    // Reference to the consumer client for cleanup
    let consumerClient: Client | null = null;

    // Setup consumer immediately
    const setupConsumer = async () => {
      try {
        consumerClient = await consumeMessageFromQueue(
          userId,
          (message: UserMatchingResponse) => {
            logger.debug(
              `Attempting to send message to user ${userId}:`,
              message,
            );
            logger.debug(
              `WebSocket readyState before sending: ${ws.readyState}`,
            );

            if (ws.readyState === WebSocket.OPEN) {
              try {
                ws.send(JSON.stringify(message));
                logger.info(`Message sent to user ${userId}:`, message);
              } catch (sendError) {
                logger.error('Error sending message via WebSocket:', sendError);
              }
            } else {
              logger.warn(
                `Cannot send message, WebSocket state for user ${userId}: ${ws.readyState}`,
              );
            }
          },
        );
      } catch (error) {
        logger.error('Error setting up RabbitMQ consumer:', error);
        ws.close();
      }
    };

    // Call setupConsumer immediately
    setupConsumer();

    ws.on('close', () => {
      // Clean up RabbitMQ consumer
      if (consumerClient) {
        consumerClient.deactivate();
        consumerClient = null;
      }
    });

    ws.on('error', (error) => {
      logger.error('WebSocket error:', error);
      ws.close();
    });
  } catch (error) {
    logger.error('Unhandled exception in WebSocket connection:', error);
    ws.close();
  }
});

// Export the WebSocket server for use in app.ts
export { wsServer };
export default router;
