import * as amqplib from "amqplib";
import QueueMessage from "./QueueMessage";
import MatchRequest from "./MatchRequest";
import { MessageHeader, ConsumerMessageHeaderReq } from "./MessageHeaders";

const TOPIC_LIST: string[] = ["algorithm", "graph", "dp"];
const DIFFICULTY_LEVELS: string[] = ["easy", "medium", "hard"];

class AmqpService {
    private connection: amqplib.Connection | null = null;
    private channel: amqplib.Channel | null = null;
    private exchange: string;
    private connectionUrl: string;

    private constructor(connectionUrl: string, exchange: string) {
        this.exchange = exchange;
        this.connectionUrl = connectionUrl;
    }

    private async init(): Promise<void> {
        await amqplib.connect(this.connectionUrl).then((conn) => {
            this.connection = conn;
            return this.connection.createChannel();
        }).then(ch => {
            this.channel = ch;
            return this.channel.assertExchange(this.exchange, "headers", { durable: false });
        }).catch((err) => console.log(err));
    }

    public static async of(connectionUrl: string, exchange: string): Promise<AmqpService> {
        var service: AmqpService = new AmqpService(connectionUrl, exchange);
        await service.init();
        await service.startConsumers();
        return service;
    }

    public async sendJsonMessage(msg: MatchRequest): Promise<void> {
        if (!this.channel) {
            console.log("Channel not initialised");
            return;
        }
        const messageHeaders: MessageHeader = {
            topic: msg.getTopic(),
            difficulty: msg.getDifficulty()
        }
        this.channel?.publish(this.exchange, "", Buffer.from(JSON.stringify(msg)), {
            headers: messageHeaders
        });
        console.log("Successfully sent message!");
    }

    public async receiveMessages(topic: string, difficulty: string, allback: (msg: QueueMessage | null) => void): Promise<void> {
        if (!this.channel) {
            console.log("Channel not initialised");
            return;
        }
        const queue = await this.channel?.assertQueue("", { exclusive: true })
        const queueName = queue?.queue;
        if (!queueName) {
            return;
        }

        var headers: ConsumerMessageHeaderReq = {
            "x-match": "all",
            "topic": topic,
            "difficulty": difficulty
        }

        await this.channel?.bindQueue(queueName, this.exchange, "", headers);
        console.log("Consumer ready");
        await this.channel?.consume(queueName, (message) => {
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