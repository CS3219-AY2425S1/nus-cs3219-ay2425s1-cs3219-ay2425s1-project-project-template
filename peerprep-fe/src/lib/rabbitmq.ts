/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, IFrame, IMessage } from '@stomp/stompjs';

const sendMessageToQueue = async (message: Record<string, any>) => {
  const uri = process.env.NEXT_PUBLIC_RABBITMQ_URL;
  const user = process.env.NEXT_PUBLIC_RABBITMQ_USER;
  const pass = process.env.NEXT_PUBLIC_RABBITMQ_PW;
  try {
    const client = new Client({
      brokerURL: uri, // WebSocket URL for RabbitMQ
      connectHeaders: {
        login: user!,
        passcode: pass!,
      },
      reconnectDelay: 5000, // auto-reconnect after 5 seconds if connection fails
    });

    client.onConnect = () => {
      const queue = process.env.NEXT_PUBLIC_QUEUE;
      const messageStr = JSON.stringify(message);

      client.publish({
        destination: queue!,
        body: messageStr,
        headers: { persistent: 'true' },
      });

      console.log(`Message sent to queue "${queue}":`, message);
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
  onMessage: (message: any) => void,
) => {
  const uri = process.env.NEXT_PUBLIC_RABBITMQ_URL;
  const user = process.env.NEXT_PUBLIC_RABBITMQ_USER;
  const pass = process.env.NEXT_PUBLIC_RABBITMQ_PW;
  try {
    const client = new Client({
      brokerURL: uri, // WebSocket URL for RabbitMQ
      connectHeaders: {
        login: user!,
        passcode: pass!,
      },
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      client.subscribe(queue, (msg: IMessage) => {
        const messageContent = JSON.parse(msg.body);
        console.log(`Received:`, messageContent);
        onMessage(messageContent);
      });

      console.log(`Waiting for messages in ${queue}...`);
    };

    client.onStompError = (error: IFrame) => {
      console.log('STOMP Error:', error);
      throw new Error('Error connecting to RabbitMQ via STOMP: ' + error.headers['message']);
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  } catch (error) {
    console.error('Error in consuming messages:', error);
    throw error;
  }
};

export { sendMessageToQueue, consumeMessageFromQueue };