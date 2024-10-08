import { Channel } from "amqplib";
import queueOptions from "./queueOptions";

/**
 * QueueManager manages the exchanges and queues of rabbitmq.
 */
class QueueManager {
    private categoryExchange: string;
    private directExchange: string;
    private channel: Channel;

    constructor(channel: Channel, categoryExchange: string, directExchange: string) {
        this.channel = channel;
        this.categoryExchange = categoryExchange;
        this.directExchange = directExchange;
    }

    public async createExchanges(): Promise<void> {
        await this.channel.assertExchange(this.categoryExchange, "headers", { durable: false });
        await this.channel.assertExchange(this.directExchange, "direct", { durable: false });
    }

    public async setupQueues(): Promise<void> {
        for (const topic of queueOptions.TOPIC_LIST) {
            for (const difficulty of queueOptions.DIFFICULTY_LEVELS) {
                const queueName = `${topic}_${difficulty}`;
                await this.channel.assertQueue(queueName, { durable: false });

                await this.channel.bindQueue(queueName, this.categoryExchange, '', {
                    "x-match": 'all',
                    "topic": topic,
                    "difficulty": difficulty
                });
            }
        }
        const cancellationQueue: string = "cancellation";
        await this.channel.assertQueue(cancellationQueue, { durable: false });
        await this.channel.bindQueue(cancellationQueue, this.directExchange, "cancellation");
    }
}

export default QueueManager;
