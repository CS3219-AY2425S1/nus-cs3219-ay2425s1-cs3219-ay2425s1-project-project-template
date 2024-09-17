import { Channel } from "amqplib";
import QueueMessage from "../models/QueueMessage";
import { ConsumerMessageHeaderReq } from "../models/MessageHeaders";

class Consumer {
    constructor() {

    }

    public async receiveMessages(topic: string, difficulty: string, exchange: string, channel: Channel, callback: (msg: QueueMessage | null) => void): Promise<void> {
        // const queue = await channel.assertQueue("", { exclusive: true })
        const queueName = `queue_${topic}_${difficulty}`;

        var headers: ConsumerMessageHeaderReq = {
            "x-match": "all",
            "topic": topic,
            "difficulty": difficulty
        }

        await channel.bindQueue(queueName, exchange, "", headers);
        await channel.consume(queueName, (message) => {
            callback(message);
        }, { noAck: true });
    }
}

export default Consumer;