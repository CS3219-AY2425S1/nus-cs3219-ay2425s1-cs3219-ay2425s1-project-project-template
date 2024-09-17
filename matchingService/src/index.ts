import AmqpService from "./QueueService/AmqpService";

interface QueueService {
    startProducers(): Promise<void>;
}

async function main() {
    var amqpService: QueueService = await AmqpService.of(process.env.RABBITMQ_URL || "amqp://localhost:5672", "gateway", "responseGateway");
    await amqpService.startProducers()
}
main();
