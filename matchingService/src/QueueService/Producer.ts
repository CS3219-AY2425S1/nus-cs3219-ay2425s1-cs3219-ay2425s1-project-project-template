import { Channel } from "amqplib";
import MatchRequest from "../models/MatchRequest";
import CancelRequest from "../models/CancelRequest";
import { MessageHeader, CancelMessageHeader } from "../models/MessageHeaders";
import { v4 as uuidv4 } from 'uuid';

/** 
 * Class representing a Producer that will push matchmaking requests into a header exchange.
 * */
class Producer {
    public async sendJsonMessage(msg: MatchRequest, channel: Channel, exchange: string, responseExchange: string): Promise<boolean> {
        const replyQueue = await channel.assertQueue("", { exclusive: true });
        const replyQueueName = replyQueue?.queue;
        if (!replyQueue) {
            console.log("Failed to create response queue");
            return false;
        }

        const correlationId = uuidv4();
        const messageHeaders: MessageHeader = {
            topic: msg.getTopic(),
            difficulty: msg.getDifficulty()
        }

        const res: Promise<boolean> = this.waitForResponse(channel, responseExchange, replyQueueName, correlationId);
        channel.publish(exchange, "", Buffer.from(JSON.stringify(msg)), {
            headers: messageHeaders,
            replyTo: replyQueueName,
            correlationId: correlationId,
        });
        return res;
    }
    
    // consume returns when the listener has been initialised. Hence, need custom handling of Promise
    private waitForResponse(channel: Channel, responseExchange: string, replyQueue: string, correlationId: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                await channel.bindQueue(replyQueue, responseExchange, replyQueue);

                const consumer = await channel.consume(replyQueue, async (message) => {
                    console.log("Producer: Received a response in waitForResponse");
                    if (message?.properties.correlationId === correlationId) {
                        console.log("Producer received Filtered Response: ", message.content.toString());

                        const response = JSON.parse(message.content.toString());
                        // Stop consuming messages after receiving the first relevant response
                        await channel.cancel(consumer.consumerTag);
                        resolve(response === true);
                    }
                }, { noAck: true });
            } catch (error) {
                console.error("Error waiting for response:", error);
                reject(false);
            }
        });
    }

    public async sendCancelMessage(msg: CancelRequest, channel: Channel, directExchange: string): Promise<boolean> {
        const replyQueue = await channel.assertQueue("", { exclusive: true });
        const replyQueueName = replyQueue?.queue;
        if (!replyQueue) {
            console.log("Failed to create response queue");
            return false;
        }

        const correlationId = uuidv4();
        const messageHeaders: CancelMessageHeader = {
            matchId: msg.getMatchId(),
        }
        console.log("Producer: Waiting at queue", replyQueue)
        const res: Promise<boolean> = this.waitForResponse(channel, directExchange, replyQueueName, correlationId);
        console.log(msg);
        channel.publish(directExchange, "cancellation", Buffer.from(JSON.stringify(msg)), {
            headers: messageHeaders,
            replyTo: replyQueueName,
            correlationId: correlationId,
        });
        return res;
    }
}

export default Producer;