import { Channel } from "amqplib";
import QueueMessage from "./QueueMessage";
import MatchRequest from "./MatchRequest";
import { MessageHeader, ConsumerMessageHeaderReq } from "./MessageHeaders";
import { ConnectionManager, IConnectionManager } from "./ConnectionManager";
import ChannelNotFoundError from "../errors/ChannelNotFoundError";

const TOPIC_LIST: string[] = ["algorithm", "graph", "dp"];
const DIFFICULTY_LEVELS: string[] = ["easy", "medium", "hard"];

class AmqpService {
    private exchange: string;
    private connectionManager: IConnectionManager;

    private constructor(exchange: string, connectionManager: IConnectionManager) {
        this.exchange = exchange;
        this.connectionManager = connectionManager;
    }

    private async init(): Promise<void> {
        var channel: Channel | null = this.connectionManager.getChannel();
        if (!channel) {
            return;
        }
        channel.assertExchange(this.exchange, "headers", { durable: false });
    }

    public static async of(connectionUrl: string, exchange: string): Promise<AmqpService> {
        var connectionManager: IConnectionManager = new ConnectionManager();
        var service: AmqpService = new AmqpService(exchange, connectionManager);
        await connectionManager.setup(connectionUrl);
        await service.init();
        await service.startConsumers();
        return service;
    }

    public async sendJsonMessage(msg: MatchRequest): Promise<void> {
        var channel: Channel = this.connectionManager.getChannel();
        if (channel instanceof ChannelNotFoundError) {
            console.error(channel.message);
            return;
        }
        const messageHeaders: MessageHeader = {
            topic: msg.getTopic(),
            difficulty: msg.getDifficulty()
        }
        channel.publish(this.exchange, "", Buffer.from(JSON.stringify(msg)), {
            headers: messageHeaders
        });
        console.log("Successfully sent message!");
    }

    public async receiveMessages(topic: string, difficulty: string, allback: (msg: QueueMessage | null) => void): Promise<void> {
        var channel: Channel = this.connectionManager.getChannel();
        if (channel instanceof ChannelNotFoundError) {
            console.error(channel.message);
            return;
        }
        const queue = await channel.assertQueue("", { exclusive: true })
        const queueName = queue?.queue;
        if (!queueName) {
            return;
        }

        var headers: ConsumerMessageHeaderReq = {
            "x-match": "all",
            "topic": topic,
            "difficulty": difficulty
        }

        await channel.bindQueue(queueName, this.exchange, "", headers);
        console.log("Consumer ready");
        await channel.consume(queueName, (message) => {
            if (message) {
                console.log(`Received message: ${message.content.toString()}`);
            }
        }, { noAck: true });
    }

    public async startConsumers(): Promise<void> {
        for (const topic of TOPIC_LIST) {
            for (const difficulty of DIFFICULTY_LEVELS) {
                await this.receiveMessages(topic, difficulty, (msg: QueueMessage | null) => {
                    let content = msg?.content.toString();
                    if (content) {
                        try {
                            var matchRequest: MatchRequest = JSON.parse(content);
                            console.log(matchRequest);
                        } catch (e) {
                            if (e instanceof Error) {
                                let name = e.message;
                                console.log(`Error occured ${name}`);
                            }
                        }
                    }
                });
            }
        }
    }
}

export default AmqpService;