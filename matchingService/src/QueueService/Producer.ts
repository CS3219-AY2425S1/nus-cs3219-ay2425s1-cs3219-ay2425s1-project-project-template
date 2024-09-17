import { Channel } from "amqplib";
import MatchRequest from "../models/MatchRequest";
import { MessageHeader } from "../models/MessageHeaders";
import { v4 as uuidv4 } from 'uuid';

/** 
 * Class representing a Producer that will push matchmaking requests into a header exchange.
 * */
class Producer {
    constructor() {

    }

    public async sendJsonMessage(msg: MatchRequest, channel: Channel, exchange: string, responseExchange: string): Promise<void> {
        const responseQueue = await channel.assertQueue("", { exclusive: true });
        const responseQueueName = responseQueue?.queue;
        if (!responseQueue) {
            console.log("Failed to create response queue");
            return;
        }
        console.log(responseQueueName);
        const messageHeaders: MessageHeader = {
            topic: msg.getTopic(),
            difficulty: msg.getDifficulty()
        }
        console.log(messageHeaders);
        console.log(exchange);
        const correlationid = uuidv4();
        await this.waitForResponse(channel, responseExchange, responseQueueName, correlationid);
        channel.publish(exchange, "", Buffer.from(JSON.stringify(msg)), {
            headers: messageHeaders,
            replyTo: responseQueueName,
            correlationId: correlationid,
        });
        console.log("Producer successfully sent message: ", msg);
    }

    public async waitForResponse(channel: Channel, responseExchange: string, replyQueue: string, correlationId: string) {
        await channel.bindQueue(replyQueue, responseExchange, replyQueue);
        console.log("Producer waiting for response....");
        const consumer = await channel.consume(replyQueue, async (message) => {
            if (message?.properties.correlationId === correlationId) {
                console.log("Producer received Response: ", message?.content.toString());
    
                // Stop consuming messages after the first relevant response is received
                await channel.cancel(consumer.consumerTag);
            } else {
                console.log("Received message with different correlationId: ", message?.content.toString());
            }
        }, { noAck: true });
    }
}

export default Producer;