import { Channel, Replies } from "amqplib";
import MatchRequest from "./MatchRequest";
import { MessageHeader } from "./MessageHeaders";
import { v4 as uuidv4 } from 'uuid';

var responseQueue: string = "responseQueue";

class Producer {
    constructor() {

    }

    public async sendJsonMessage(msg: MatchRequest, channel: Channel, exchange: string): Promise<void> {
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
        await this.waitForResponse(channel, exchange, responseQueueName, correlationid);
        channel.publish(exchange, "", Buffer.from(JSON.stringify(msg)), {
            headers: messageHeaders,
            replyTo: responseQueueName,
            correlationId: correlationid,
        });
        console.log("Producer successfully sent message: ", msg);
    }

    public async waitForResponse(channel: Channel, exchange: string, replyQueue: string, correlationId: string) {
        await channel.bindQueue(replyQueue, exchange, "", {
            'x-match': 'all',
            "correlationId": correlationId,
        });
        console.log("Producer waiting for response....");
        const consumer = await channel.consume(replyQueue, async (message) => {
            if (message?.properties.correlationId === correlationId) {
                console.log("Producer received Response: ", message?.content.toString());
    
                // Stop consuming messages after the first relevant response is received
                // await channel.cancel(consumer.consumerTag);
            } else {
                console.log("Received message with different correlationId: ", message?.content.toString());
            }
        }, { noAck: true });
    }
}

export default Producer;