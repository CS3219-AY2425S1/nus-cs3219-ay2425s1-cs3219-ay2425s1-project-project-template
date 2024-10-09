import { Channel } from "amqplib";
import MatchRequest from "../models/MatchRequest";
import CancelRequest from "../models/CancelRequest";
import { MessageHeader, CancelMessageHeader } from "../models/MessageHeaders";
import { v4 as uuidv4 } from 'uuid';
import logger from "../utils/logger"; // Import your logger

/** 
 * Class representing a Producer that will push matchmaking requests into a header exchange.
 */
class Producer {
    public async sendRequest(msg: MatchRequest, channel: Channel, exchange: string, responseExchange: string): Promise<boolean> {
        logger.info(`Sending match request for topic: ${msg.getTopic()}, difficulty: ${msg.getDifficulty()}`);
        
        const replyQueue = await channel.assertQueue("", { exclusive: true });
        const replyQueueName = replyQueue?.queue;
        if (!replyQueue) {
            logger.error("Failed to create response queue");
            return false;
        }

        const correlationId = uuidv4();
        const messageHeaders: MessageHeader = {
            topic: msg.getTopic(),
            difficulty: msg.getDifficulty()
        };

        const res: Promise<boolean> = this.waitForResponse(channel, responseExchange, replyQueueName, correlationId); // Listen before publishing message to ensure we do not miss the response
        channel.publish(exchange, "", Buffer.from(JSON.stringify(msg)), {
            headers: messageHeaders,
            replyTo: replyQueueName,
            correlationId: correlationId,
        });

        logger.info(`Match request sent with correlation ID: ${correlationId}`);
        return res;
    }
    
    private waitForResponse(channel: Channel, responseExchange: string, replyQueue: string, correlationId: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                await channel.bindQueue(replyQueue, responseExchange, replyQueue);
                logger.debug(`Waiting for response on queue: ${replyQueue} with correlation ID: ${correlationId}`);

                const consumer = await channel.consume(replyQueue, async (message) => { // consume returns immediately after initializing listener. Hence, need custom handling of Promise
                    if (message?.properties.correlationId === correlationId) {
                        logger.info("Producer received filtered response: ", message.content.toString());

                        const response = JSON.parse(message.content.toString());
                        await channel.cancel(consumer.consumerTag); // Stop consuming messages after receiving the first relevant response
                        resolve(response === true);
                    }
                }, { noAck: true });
            } catch (error) {
                logger.error("Error waiting for response:", error);
                reject(false);
            }
        });
    }

    public async sendCancelMessage(msg: CancelRequest, channel: Channel, directExchange: string): Promise<boolean> {
        logger.info(`Sending cancel request for match ID: ${msg.getMatchId()}`);

        const replyQueue = await channel.assertQueue("", { exclusive: true });
        const replyQueueName = replyQueue?.queue;
        if (!replyQueue) {
            logger.error("Failed to create response queue");
            return false;
        }

        const correlationId = uuidv4();
        const messageHeaders: CancelMessageHeader = {
            matchId: msg.getMatchId(),
        };
        
        const res: Promise<boolean> = this.waitForResponse(channel, directExchange, replyQueueName, correlationId); // Listen before publishing message to ensure we do not miss the response
        channel.publish(directExchange, "cancellation", Buffer.from(JSON.stringify(msg)), {
            headers: messageHeaders,
            replyTo: replyQueueName,
            correlationId: correlationId,
        });

        logger.info(`Cancellation request sent with correlation ID: ${correlationId}`);
        return res;
    }
}

export default Producer;
