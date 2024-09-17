import { Channel } from "amqplib";
import QueueMessage from "../models/QueueMessage";
import MatchRequest from "../models/MatchRequest";
import MatchRequestWithQueueInfo from "../models/MatchRequestWithQueueInfo";

/** 
 * Class repesenting a Consumer that consumes incoming messages from queues that will contain messages 
 * regarding Matchmaking requests partitioned based on (topic, difficulty) 
 * */
class Consumer {
    private pendingMatch: MatchRequestWithQueueInfo | null;
    constructor() {
        this.pendingMatch = null;
    }

    public async receiveMessages(topic: string, difficulty: string, responseExchange: string, channel: Channel): Promise<void> {
        const queueName = `${topic}_${difficulty}`;
        await channel.consume(queueName, (message) => {
            this.handleMatchRequest(message, queueName, channel, responseExchange);
        }, { noAck: true });
    }

    private handleMatchRequest(msg: QueueMessage | null, queueName: string, channel: Channel, responseExchange: string) {
        let content = msg?.content.toString();
        if (!content) {
            return;
        }
        try {
            var matchRequest: MatchRequest = this.parseMatchRequest(content)
            const correlationId: string = msg?.properties.correlationId;
            const replyQueue: string = msg?.properties.replyTo;
            console.log("Consumer received match request: ", matchRequest);
            this.processMatchRequest(matchRequest, replyQueue, correlationId, channel, responseExchange);
        } catch (e) {
            if (e instanceof Error) {
                let name = e.message;
                console.log(`Error occured ${name}`);
            }
        }
    }

    private parseMatchRequest(content: string): MatchRequest {
        const jsonObject = JSON.parse(content);
        return new MatchRequest(jsonObject.userId, jsonObject.topic, jsonObject.difficulty);
    }

    private processMatchRequest(matchRequest: MatchRequest, replyQueue: string, correlationId: string, channel: Channel, responseExchange: string) {
        if (!this.pendingMatch) {
            this.pendingMatch = MatchRequestWithQueueInfo.createFromMatchRequest(matchRequest, replyQueue, correlationId);
            return;
        }
        var matchRequest2: MatchRequestWithQueueInfo = MatchRequestWithQueueInfo.createFromMatchRequest(matchRequest, replyQueue, correlationId);
        this.matchAndRespond(this.pendingMatch, matchRequest2, channel, responseExchange)
    }

    private matchAndRespond(req1: MatchRequestWithQueueInfo, req2: MatchRequestWithQueueInfo, channel: Channel, responseExchange: string): void {
        channel.publish(responseExchange, req1.getQueue(), Buffer.from("Successfully matched"), {
            correlationId: req1.getCorrelationId(),
            });
        channel.publish(responseExchange, req2.getQueue(), Buffer.from("Successfully matched"), {
        correlationId: req2.getCorrelationId(),
        });
        this.pendingMatch = null;
    }
}

export default Consumer;