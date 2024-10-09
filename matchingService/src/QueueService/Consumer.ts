import { Channel } from "amqplib";
import QueueMessage from "../models/QueueMessage";
import CancelRequest from "../models/CancelRequest";
import MatchRequest from "../models/MatchRequest";
import MatchRequestWithQueueInfo from "../models/MatchRequestWithQueueInfo";
import CancelRequestWithQueueInfo from "../models/CancelRequestWithQueueInfo";
import logger from "../utils/logger";

/** 
 * Consumer consumes incoming messages from queues that will contain Matchmaking requests
 * MatchMaking requests are partitioned based on (topic, difficulty) 
 * */
class Consumer {
    private pendingReq: MatchRequestWithQueueInfo | null;
    private cancelledMatches: Map<string, CancelRequestWithQueueInfo> = new Map();

    constructor() {
        this.pendingReq = null;
    }

    public async consumeMatchRequest(topic: string, difficulty: string, directExchange: string, channel: Channel): Promise<void> {
        const queueName = `${topic}_${difficulty}`;
        logger.info(`Consuming match requests from queue: ${queueName}`);
        
        await channel.consume(queueName, (message) => {
            this.handleMatchRequest(message, channel, directExchange);
        }, { noAck: true });
    }

    public async consumeCancelRequest(channel: Channel, directExchange: string) {
        logger.info("Consuming cancellation requests from queue: cancellation");

        channel.consume("cancellation", (msg) => {
            this.handleCancellationRequest(msg, channel, directExchange);
        }, { noAck: true });
    }

    private handleMatchRequest(msg: QueueMessage | null, channel: Channel, directExchange: string): void {
        if (!msg) {
            logger.warn("Received null message in handleMatchRequest");
            return;
        }
        
        logger.debug("Consumer received match request");
        try {
            const req: MatchRequest = this.parseMatchRequest(msg);
            const correlationId: string = msg?.properties.correlationId;
            const replyQueue: string = msg?.properties.replyTo;

            if (this.pendingReq && this.isCancelledMatchRequest(this.pendingReq.getMatchId())) {
                this.processCancelRequest(this.pendingReq.getMatchId(), this.pendingReq.getCorrelationId(),
                    this.pendingReq.getQueue(), channel, directExchange);
                return;
            }

            if (this.isCancelledMatchRequest(req.getMatchId())) {
                this.processCancelRequest(req.getMatchId(), correlationId,
                    replyQueue, channel, directExchange);
                return;
            }

            this.processMatchRequest(req, replyQueue, correlationId, channel, directExchange);
        } catch (e) {
            if (e instanceof Error) {
                logger.error(`Error occurred while handling match request: ${e.message}`);
            } else {
                logger.error(`Unexpected error occurred: ${JSON.stringify(e)}`);
            }
        }
    }

    private parseMatchRequest(msg: QueueMessage): MatchRequest {
        const content: string = msg.content.toString();
        if (!content) {
            logger.error("Message content is empty!");
            throw new Error("Message content is empty!");
        }

        logger.debug(`Parsing match request content: ${content}`);
        const jsonObject = JSON.parse(content);
        logger.debug(`Parsed JSON object: ${JSON.stringify(jsonObject)}`);

        return new MatchRequest(jsonObject.userId, jsonObject.matchId, jsonObject.topic, jsonObject.difficulty);
    }

    private processMatchRequest(incomingReq: MatchRequest, replyQueue: string, correlationId: string, channel: Channel, responseExchange: string): void {
        logger.debug(`Processing match request: ${incomingReq.getMatchId()}`);

        if (!this.pendingReq) {
            this.pendingReq = MatchRequestWithQueueInfo.createFromMatchRequest(incomingReq, replyQueue, correlationId);
            logger.debug(`Stored pending request: ${incomingReq.getMatchId()}`);
            return;
        }

        var incomingReqWithQueueInfo: MatchRequestWithQueueInfo = MatchRequestWithQueueInfo.createFromMatchRequest(incomingReq, replyQueue, correlationId);
        logger.debug(`Matching and responding to requests: ${this.pendingReq.getMatchId()} and ${incomingReq.getMatchId()}`);
        this.matchAndRespond(this.pendingReq, incomingReqWithQueueInfo, channel, responseExchange);
    }

    private matchAndRespond(req1: MatchRequestWithQueueInfo, req2: MatchRequestWithQueueInfo, channel: Channel, responseExchange: string): void {
        logger.debug(`Responding to matched requests: ${req1.getMatchId()} and ${req2.getMatchId()}`);
        
        channel.publish(responseExchange, req1.getQueue(), Buffer.from(JSON.stringify(true)), {
            correlationId: req1.getCorrelationId(),
        });
        channel.publish(responseExchange, req2.getQueue(), Buffer.from(JSON.stringify(true)), {
            correlationId: req2.getCorrelationId(),
        });

        logger.debug("Responses sent to matched requests");
        this.pendingReq = null;
    }

    private handleCancellationRequest(msg: QueueMessage | null, channel: Channel, directExchange: string): void {
        if (!msg) {
            logger.warn("Received null message in handleCancellationRequest");
            return;
        }
        
        try {
            var req: CancelRequest = this.parseCancelRequest(msg);
            const correlationId: string = msg.properties.correlationId;
            const replyQueue: string = msg.properties.replyTo;

            const reqWithInfo: CancelRequestWithQueueInfo = CancelRequestWithQueueInfo.createFromCancelRequest(req, replyQueue, correlationId);
            this.cancelledMatches.set(req.getMatchId(), reqWithInfo);
            logger.debug(`Cancelled match request added: ${req.getMatchId()}`);

            if (!this.pendingReq) {
                logger.debug("No pending requests to cancel");
                return;
            }

            if (this.pendingReq.getMatchId() == reqWithInfo.getMatchId()) {
                this.processCancelRequest(reqWithInfo.getMatchId(), this.pendingReq.getCorrelationId(),
                    this.pendingReq.getQueue(), channel, directExchange);
                return;
            }
        } catch (e) {
            if (e instanceof Error) {
                logger.error(`Error occurred while handling cancellation request: ${e.message}`);
            } else {
                logger.error(`Unexpected error occurred: ${JSON.stringify(e)}`);
            }
        }
    }

    private processCancelRequest(matchId: string, matchCorrelationId: string, matchReplyQueue: string, channel: Channel, directExchange: string): void {
        logger.debug(`Processing cancellation for match ID: ${matchId}`);
        
        const cancellationResponseQueue: CancelRequestWithQueueInfo | null = this.getCancellationResponseQueue(matchId);
        if (!cancellationResponseQueue) {
            logger.warn("Missing response queue for cancellation");
            return;
        }
        
        this.pendingReq = null; // Remove existing pending match
        this.deleteCancellationMatchRequest(matchId);

        // respond to match request
        logger.debug(`Responding to match request: ${matchReplyQueue}`);
        channel.publish(directExchange, matchReplyQueue, Buffer.from(JSON.stringify(false)), {
            correlationId: matchCorrelationId,
        });

        // respond to cancel request
        logger.debug(`Responding to cancel request: ${cancellationResponseQueue.getQueue()}`);
        channel.publish(directExchange, cancellationResponseQueue.getQueue(), Buffer.from(JSON.stringify(true)), {
            correlationId: cancellationResponseQueue.getCorrelationId(),
        });
        return;
    }

    private parseCancelRequest(msg: QueueMessage): CancelRequest {
        const content: string = msg.content.toString();
        if (!content) {
            logger.error("Message content should not be empty!");
            throw new Error("Message content should not be empty!");
        }
        
        logger.debug(`Parsing cancellation request content: ${content}`);
        const jsonObject = JSON.parse(content);
        logger.debug(`Parsed cancellation JSON object: ${JSON.stringify(jsonObject)}`);

        return new CancelRequest(jsonObject.matchId);
    }

    private isCancelledMatchRequest(matchId: string): boolean {
        const isCancelled = this.cancelledMatches.has(matchId);
        logger.debug(`Match ID ${matchId} is cancelled: ${isCancelled}`);
        return isCancelled;
    }

    private getCancellationResponseQueue(matchId: string): CancelRequestWithQueueInfo | null {
        if (this.isCancelledMatchRequest(matchId)) {
            const cancelReq: CancelRequestWithQueueInfo | undefined = this.cancelledMatches.get(matchId);
            if (!cancelReq) {
                logger.warn(`Cancellation request not found for match ID: ${matchId}`);
                return null;
            }
            logger.debug(`Found cancellation request for match ID: ${matchId}`);
            return cancelReq;
        }
        return null;
    }

    private deleteCancellationMatchRequest(matchId: string): void {
        if (this.isCancelledMatchRequest(matchId)) {
            logger.debug(`Deleting cancelled match request: ${matchId}`);
            this.cancelledMatches.delete(matchId);
        }
    }
}

export default Consumer;
