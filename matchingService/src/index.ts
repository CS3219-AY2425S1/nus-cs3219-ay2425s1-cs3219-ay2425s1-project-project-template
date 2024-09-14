import AmqpService from "./QueueService/AmqpService";
import QueueMessage from "./QueueService/QueueMessage";
import MatchRequest from "./QueueService/MatchRequest";

interface QueueService {
    sendJsonMessage(queue: string, msg: MatchRequest): void;
    receiveMessages(queue: string, callback: (msg: QueueMessage | null) => void): void;
}

var amqpService: QueueService = new AmqpService("amqp://localhost:5672");

const message: MatchRequest = {
    userId: "John",
    topic: "algorithm",
    difficulty: "hard",
}

amqpService.sendJsonMessage("matchQueue", message);

amqpService.receiveMessages("hello", (msg: QueueMessage | null) => {
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
})
