import { Channel } from "amqplib";
import MatchRequest from "../models/MatchRequest";
import { MessageHeader } from "../models/MessageHeaders";
import { v4 as uuidv4 } from 'uuid';

/** 
 * Class representing a Producer that will push matchmaking requests into a header exchange.
 * TODO: To be utilised by frontend.
 * */
class Producer {
    public async sendJsonMessage(msg: MatchRequest, channel: Channel, exchange: string, responseExchange: string): Promise<void> {
        const replyQueue = await channel.assertQueue("", { exclusive: true });
        const replyQueueName = replyQueue?.queue;
        if (!replyQueue) {
            console.log("Failed to create response queue");
            return;
        }
        const messageHeaders: MessageHeader = {
            topic: msg.getTopic(),
            difficulty: msg.getDifficulty()
        }
        const correlationId = uuidv4();
        await this.waitForResponse(channel, responseExchange, replyQueueName, correlationId);
        channel.publish(exchange, "", Buffer.from(JSON.stringify(msg)), {
            headers: messageHeaders,
            replyTo: replyQueueName,
            correlationId: correlationId,
        });
        console.log("Producer successfully sent message: ", msg);
    }

    private async waitForResponse(channel: Channel, responseExchange: string, replyQueue: string, correlationId: string) {
        await channel.bindQueue(replyQueue, responseExchange, replyQueue);
        const consumer = await channel.consume(replyQueue, async (message) => {
            if (message?.properties.correlationId === correlationId) {
                console.log("Producer received Response: ", message?.content.toString());
                await channel.cancel(consumer.consumerTag); // Stop consuming messages after receiving first relevant response
            }
        }, { noAck: true });
    }
}

export default Producer;