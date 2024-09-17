import { Channel } from "amqplib";
import QueueMessage from "../models/QueueMessage";
import MatchRequest from "../models/MatchRequest";

class Consumer {
    constructor() {

    }

    public async receiveMessages(topic: string, difficulty: string, responseExchange: string, channel: Channel): Promise<void> {
        const queueName = `${topic}_${difficulty}`;
        await channel.consume(queueName, (message) => {
            this.handleMatchRequest(message, channel, responseExchange);
        }, { noAck: true });
    }

    private handleMatchRequest(msg: QueueMessage | null, channel: Channel, responseExchange: string) {
        let content = msg?.content.toString();
        if (content) {
            try {
                var matchRequest: MatchRequest = JSON.parse(content);
                console.log("Consumer received match request: ", matchRequest);
                const correlationId: string = msg?.properties.correlationId;
                const responseQueue: string = msg?.properties.replyTo;
                channel.publish(responseExchange, responseQueue, Buffer.from("Successfully matched"), {
                    correlationId: correlationId,
                  });
            } catch (e) {
                if (e instanceof Error) {
                    let name = e.message;
                    console.log(`Error occured ${name}`);
                }
            }
        }
    }
}

export default Consumer;