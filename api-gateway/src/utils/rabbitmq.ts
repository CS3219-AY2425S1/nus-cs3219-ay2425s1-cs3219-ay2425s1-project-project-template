/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserMatchingRequest, UserMatchingResponse } from '../types/types';
import { Client, IFrame, IMessage } from '@stomp/stompjs';
import config from '../config';
import WebSocket from 'ws';
import logger from './logger';

// @ts-ignore
global.WebSocket = WebSocket; // Make WebSocket available globally

let isConnected = false;

const sendMessageToQueue = async (message: UserMatchingRequest) => {
  const uri = config.rabbitmq.url;
  const user = config.rabbitmq.username;
  const pass = config.rabbitmq.password;
  const queue = config.rabbitmq.queue;

  if (isConnected) {
    return; // Prevent sending if already connected
  }

  try {
    const client = new Client({
      brokerURL: uri, // WebSocket URL for RabbitMQ Broker
      connectHeaders: {
        login: user!,
        passcode: pass!,
      },
      reconnectDelay: 5000, // auto-reconnect after 5 seconds if connection fails
    });

    client.onConnect = () => {
      isConnected = true; // Update connection status
      const messageStr = JSON.stringify(message);

      client.publish({
        destination: queue!,
        body: messageStr,
        headers: { persistent: 'true' },
      });

      console.log(`Message sent to queue "${queue}":`, message);
      client.deactivate(); // Deactivate client after sending
      isConnected = false; // Reset connection status
    };

    client.onStompError = (error: IFrame) => {
      console.error('STOMP Error:', error);
      throw new Error('Error connecting to RabbitMQ via STOMP');
    };

    client.activate();
  } catch (err) {
    console.error('Error sending message to RabbitMQ:', err);
    throw err;
  }
};

const consumeMessageFromQueue = async (
  queue: string,
  onMessage: (message: UserMatchingResponse) => void,
): Promise<Client> => {
  // Return Client instance
  const uri = config.rabbitmq.url;
  const user = config.rabbitmq.username;
  const pass = config.rabbitmq.password;

  const client = new Client({
    brokerURL: uri, // WebSocket URL for RabbitMQ
    connectHeaders: {
      login: user!,
      passcode: pass!,
    },
    reconnectDelay: 5000,
  });

  client.onConnect = () => {
    logger.info(`Connected to RabbitMQ for queue: ${queue}`);
    client.subscribe(queue, (msg: IMessage) => {
      const messageContent = JSON.parse(msg.body);
      logger.debug(`Received message from queue ${queue}:`, messageContent);
      onMessage(messageContent);
      // Keep the consumer active for multiple messages
    });

    logger.info(`Waiting for messages in ${queue}...`);
  };

  client.onStompError = (error: IFrame) => {
    logger.error('STOMP Error:', error);
    throw new Error(
      'Error connecting to RabbitMQ via STOMP: ' + error.headers['message'],
    );
  };

  client.onDisconnect = () => {
    logger.info(`Disconnected from RabbitMQ for queue: ${queue}`);
  };

  client.activate();

  return client; // Return the client for later deactivation
};

export { sendMessageToQueue, consumeMessageFromQueue };
