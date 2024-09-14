import amqp from "amqplib/callback_api";
import { Options } from "amqplib/callback_api";
import QueueMessage from "./QueueMessage";
import AmqpConnectionError from "../errors/AmqpConnectionError";
import AmqpCreateChannelError from "../errors/AmqpCreateChannelError";
import MatchRequest from "./MatchRequest";

type ConnectCallback = (error: AmqpConnectionError | null, connection: amqp.Connection) => void;
type CreateChannelCallback = (error: AmqpCreateChannelError | null, channel: amqp.Channel) => void;

class AmqpService {
    private connectionUrl: string;

    constructor(connectionUrl: string) {
        this.connectionUrl = connectionUrl;
    }

    private connect(callback: ConnectCallback): void {
        amqp.connect(this.connectionUrl, callback);
    }

    private createChannel(connection: amqp.Connection, callback: CreateChannelCallback) {
        connection.createChannel(callback);
    }

    public sendJsonMessage(queue: string, msg: MatchRequest) {
        this.connect((error0: AmqpConnectionError | null, connection: amqp.Connection) => {
            if (error0) {
                return error0;
            }
            this.createChannel(connection, (error1: AmqpCreateChannelError | null, channel: amqp.Channel) => {
                if (error1) {
                    throw error1;
                }
        
                const options: Options.AssertQueue = {
                    durable: false,
                }
        
                channel.assertQueue(queue, options);
                for (let i = 0; i < 5; i++) {
                    channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
                    console.log(" [x] Sent %s", msg);
                }
            })
            setTimeout(function() {
                connection.close();
            }, 500);
        })
    }

    public receiveMessages(queue: string, callback: (msg: QueueMessage | null) => void): void {
        this.connect((error0: AmqpConnectionError | null, connection: amqp.Connection) => {
            if (error0) {
                throw error0;
            }
            connection.createChannel((error1: AmqpCreateChannelError | null, channel: amqp.Channel) => {
                if (error1) {
                    throw error1;
                }
                const options: amqp.Options.AssertQueue = { durable: false };

                channel.assertQueue(queue, options);
                console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

                channel.consume(queue, (msg: amqp.Message | null) => {
                    if (msg) {
                        callback(msg);
                    }
                }, { noAck: true });
            });
        });
    }
}

export default AmqpService;