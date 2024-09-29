import { Channel } from "amqplib";
import QueueMessage from "../models/QueueMessage";
import CancelRequest from "../models/CancelRequest";
import MatchRequest from "../models/MatchRequest";
import MatchRequestWithQueueInfo from "../models/MatchRequestWithQueueInfo";
import CancelRequestWithQueueInfo from "../models/CancelRequestWithQueueInfo";

/** 
 * Class repesenting a Consumer that consumes incoming messages from queues that will contain messages 
 * regarding Matchmaking requests partitioned based on (topic, difficulty) 
 * */
class Consumer {
    private pendingMatch: MatchRequestWithQueueInfo | null;
    private cancelledMatches: Map<string, CancelRequestWithQueueInfo> = new Map();

    constructor() {
        this.pendingMatch = null;
    }

    private isCancelledMatchRequest(matchId: string): boolean {
        return this.cancelledMatches.has(matchId);
    }

    private getCancellationResponseQueue(matchId: string): CancelRequestWithQueueInfo | null {
        if (this.isCancelledMatchRequest(matchId)) {
            const cancelReq: CancelRequestWithQueueInfo | undefined = this.cancelledMatches.get(matchId);
            if (!cancelReq) {
                return null;
            }
            return cancelReq;
        }
        return null;
    }

    private deleteCancellationMatchRequest(matchId: string): void {
        if (this.isCancelledMatchRequest(matchId)) {
            this.cancelledMatches.delete(matchId);
        }
    }

    public async receiveCancelRequests(channel: Channel, directExchange: string) {
        channel.consume("cancellation", (msg) => {
            this.handleCancellationRequest(msg, channel, directExchange);
        }, { noAck: true }); // Enable auto ack of message
    }

    public async receiveMessages(topic: string, difficulty: string, directExchange: string, channel: Channel): Promise<void> {
        const queueName = `${topic}_${difficulty}`;
        await channel.consume(queueName, (message) => {
            this.handleMatchRequest(message, queueName, channel, directExchange);
        }, { noAck: true });
    }

    private handleMatchRequest(msg: QueueMessage | null, queueName: string, channel: Channel, directExchange: string) {
        let content = msg?.content.toString();
        if (!content) {
            return;
        }
        try {
            var matchRequest: MatchRequest = this.parseMatchRequest(content)
            const correlationId: string = msg?.properties.correlationId;
            const replyQueue: string = msg?.properties.replyTo;
            console.log("Consumer received match request: ", matchRequest);
            if (this.pendingMatch) {
                if (this.isCancelledMatchRequest(this.pendingMatch.getMatchId())) {
                    this.processCancelRequest(this.pendingMatch.getMatchId(), this.pendingMatch.getCorrelationId()
                        , this.pendingMatch.getQueue(), channel, directExchange)
                    return;
                }
            }
            if (this.isCancelledMatchRequest(matchRequest.getMatchId())) {
                this.processCancelRequest(matchRequest.getMatchId(), correlationId, 
                    replyQueue, channel, directExchange)
                return;
            }
            this.processMatchRequest(matchRequest, replyQueue, correlationId, channel, directExchange);
        } catch (e) {
            if (e instanceof Error) {
                let name = e.message;
                console.log(`Error occured ${name}`);
            }
        }
    }

    private parseMatchRequest(content: string): MatchRequest {
        const jsonObject = JSON.parse(content);
        return new MatchRequest(jsonObject.userId, jsonObject.matchId, jsonObject.topic, jsonObject.difficulty);
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
        channel.publish(responseExchange, req1.getQueue(), Buffer.from(JSON.stringify(true)), {
            correlationId: req1.getCorrelationId(),
            });
        channel.publish(responseExchange, req2.getQueue(), Buffer.from(JSON.stringify(true)), {
            correlationId: req2.getCorrelationId(),
        });
        this.pendingMatch = null;
    }

    private processCancelRequest(matchId: string, matchCorrelationId: string, matchReplyQueue: string, channel: Channel, directExchange: string) {
        console.log("Processing cancellation");
        const cancellationResponseQueue: CancelRequestWithQueueInfo | null = this.getCancellationResponseQueue(matchId);
        if (!cancellationResponseQueue) {
            console.log("Missing response queue");
            return;
        }
        console.log(cancellationResponseQueue.getQueue());
        console.log("Consumer: Replying to queue", cancellationResponseQueue.getQueue());
        this.pendingMatch = null; // Remove existing pending match
        this.deleteCancellationMatchRequest(matchId);
        // respond to match request
        channel.publish(directExchange, matchReplyQueue, Buffer.from(JSON.stringify(false)), {
            correlationId: matchCorrelationId,
        });
        // respond to cancel request
        channel.publish(directExchange, cancellationResponseQueue.getQueue(), Buffer.from(JSON.stringify(true)), {
            correlationId: cancellationResponseQueue.getCorrelationId(),
        });
        return;
    }

    private handleCancellationRequest(msg: QueueMessage | null, channel: Channel, directExchange: string) {
        console.log("Received cancellation request");
        if (!msg) {
            return;
        }
        let content = msg.content.toString();
        const correlationId: string = msg?.properties.correlationId;
        const replyQueue: string = msg?.properties.replyTo;
        var req: CancelRequest = this.parseCancelRequest(content);
        var reqWithInfo: CancelRequestWithQueueInfo = CancelRequestWithQueueInfo.createFromCancelRequest(req, replyQueue, correlationId);
        this.cancelledMatches.set(req.getMatchId(), reqWithInfo)
        if (this.pendingMatch?.getMatchId() == reqWithInfo.getMatchId()) { // Check if the current match in memory is the one to be canceled
            this.processCancelRequest(reqWithInfo.getMatchId(), this.pendingMatch.getCorrelationId(), 
                this.pendingMatch.getQueue(), channel, directExchange);
            return;
        }
    }

    private parseCancelRequest(content: string): CancelRequest {
        const jsonObject = JSON.parse(content);
        console.log("JSON: ", jsonObject);
        return new CancelRequest(jsonObject.matchId);
    }
}

export default Consumer;