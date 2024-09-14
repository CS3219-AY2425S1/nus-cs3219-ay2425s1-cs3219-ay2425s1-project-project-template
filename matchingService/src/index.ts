import AmqpService from "./QueueService/AmqpService";
import QueueMessage from "./QueueService/QueueMessage";
import MatchRequest from "./QueueService/MatchRequest";

interface QueueService {
    sendJsonMessage(msg: MatchRequest): Promise<void>;
    receiveMessages(topic: string, difficulty: string, callback: (msg: QueueMessage | null) => void): Promise<void>;
}

const testMessages: MatchRequest[] = [
    new MatchRequest("john", "algorithm", "hard"),
    new MatchRequest("amy", "algorithm", "medium"),
    new MatchRequest("johhny", "graph", "easy"),
    new MatchRequest("bob", "graph", "easy"),
    new MatchRequest("the builder", "dp", "medium"),
];

(async () => {
    var amqpService: QueueService = await AmqpService.of("amqp://localhost:5672", "gateway");
    
    for (const testMessage of testMessages) {
        await amqpService.sendJsonMessage(testMessage);
    }
})();
