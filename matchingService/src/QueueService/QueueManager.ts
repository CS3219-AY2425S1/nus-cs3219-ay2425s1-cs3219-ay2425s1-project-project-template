import { Channel } from "amqplib";
import { Difficulty, Topic } from "./matchingEnums";
import logger from "../utils/logger";

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
        logger.info("Successully set up exchanges");
    }

    public async setupQueues(): Promise<void> {
        for (const topic of Object.values(Topic)) {
            for (const difficulty of Object.values(Difficulty)) {
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

        // Static queue to store responses
        const responseQueue: string = "response";
        await this.channel.assertQueue(responseQueue, { durable: false });
        await this.channel.bindQueue(responseQueue, this.directExchange, "response");
        logger.info("Successully created and binded queues to exchanges");
    }
}

export default QueueManager;
