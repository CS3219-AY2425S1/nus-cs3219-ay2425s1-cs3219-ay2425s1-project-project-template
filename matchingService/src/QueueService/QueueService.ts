import { Channel } from "amqplib";
import MatchRequest from "../models/MatchRequest";
import CancelRequest from "../models/CancelRequest";
import { ConnectionManager, IConnectionManager } from "../config/ConnectionManager";
import ChannelNotFoundError from "../errors/ChannelNotFoundError";
import Consumer from "./Consumer";
import Producer from "./Producer";
import QueueManager from "./QueueManager";
import queueOptions from "./queueOptions";

/**
 * QueueService manages message queues for RabbitMq.
 * It provides an interface for sending match request messages into the queues and match cancellation requests.
 */
class QueueService {
    private categoryExchange: string;
    private directExchange: string;
    private connectionManager: IConnectionManager;
    private queueManager: QueueManager;

    private constructor(categoryExchange: string, directExchange: string, connectionManager: IConnectionManager, queueManager: QueueManager) {
        this.categoryExchange = categoryExchange;
        this.connectionManager = connectionManager;
        this.directExchange = directExchange;
        this.queueManager = queueManager;
    }

    public static async of(connectionUrl: string, categoryExchange: string, responseExchange: string): Promise<QueueService> {
        var connectionManager: IConnectionManager = new ConnectionManager();
        await connectionManager.setup(connectionUrl);
        var channel: Channel = connectionManager.getChannel();
        const queueManager: QueueManager = new QueueManager(channel, categoryExchange, responseExchange);

        const service: QueueService = new QueueService(categoryExchange, responseExchange, connectionManager, queueManager);
        await service.init();
        await service.startConsumers();
        return service;
    }

    private async init(): Promise<void> {
        var channel: Channel | null = this.connectionManager.getChannel();
        if (!channel) {
            return;
        }
        await this.queueManager.createExchanges();
        await this.queueManager.setupQueues();
    }

    public async startConsumers(): Promise<void> {
        var channel: Channel = this.connectionManager.getChannel();
        if (channel instanceof ChannelNotFoundError) {
            console.error(channel.message);
            return;
        }
        var consumer: Consumer = new Consumer();
        for (const topic of queueOptions.TOPIC_LIST) {
            for (const difficulty of queueOptions.DIFFICULTY_LEVELS) {
                await consumer.receiveMatchRequest(topic, difficulty, this.directExchange, channel);
            }
        }
        await consumer.receiveCancelRequests(channel, this.directExchange);
    }

    public async sendMatchRequest(matchRequest: MatchRequest): Promise<boolean> {
        var channel: Channel = this.connectionManager.getChannel();
        if (channel instanceof ChannelNotFoundError) {
            console.error(channel.message);
            return false;
        }
        var producer: Producer = new Producer();
        return producer.sendRequest(matchRequest, channel, this.categoryExchange, this.directExchange);
    }

    public async cancelMatchRequest(matchId: string): Promise<boolean> {
        var channel: Channel = this.connectionManager.getChannel();
        if (channel instanceof ChannelNotFoundError) {
            console.error(channel.message);
            return false;
        }
        var producer: Producer = new Producer();
        var req: CancelRequest = new CancelRequest(matchId);
        return await producer.sendCancelMessage(req, channel, this.directExchange);
    }
}

export default QueueService;