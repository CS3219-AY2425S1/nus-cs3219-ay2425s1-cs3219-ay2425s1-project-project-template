import AmqpService from "./QueueService/AmqpService";
import QueueMessage from "./QueueService/QueueMessage";

interface QueueService {
    sendMessage(queue: string, msg: string): void;
    receiveMessages(queue: string, callback: (msg: QueueMessage | null) => void): void;
}

var amqpService: QueueService = new AmqpService("amqp://localhost:5672");

amqpService.sendMessage("hello", "hello world");

amqpService.receiveMessages("hello", (msg: QueueMessage | null) => {
    console.log(msg?.content.toString());
})
