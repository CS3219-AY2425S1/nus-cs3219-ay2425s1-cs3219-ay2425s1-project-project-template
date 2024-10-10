import { Channel } from "amqplib";
import QueueMessage from "../models/QueueMessage";
import CancelRequest from "../models/CancelRequest";
import MatchRequest from "../models/MatchRequest";
import MatchRequestWithQueueInfo from "../models/MatchRequestWithQueueInfo";
import CancelRequestWithQueueInfo from "../models/CancelRequestWithQueueInfo";
import logger from "../utils/logger";
import MatchRequestWithId from "../models/MatchRequestWIthId";
import QueueManager from "./QueueManager";

/** 
 * Consumer consumes incoming messages from queues that will contain Matchmaking requests
 * MatchMaking requests are partitioned based on (topic, difficulty) 
 * */
class Consumer {
    private channel: Channel;
    private directExchange: string;
    private pendingReq: MatchRequestWithQueueInfo | null;
    private cancelledMatches: Map<string, CancelRequestWithQueueInfo> = new Map();
    private cleanupInterval: NodeJS.Timeout;

    constructor(channel: Channel, directExchange: string) {
        this.channel = channel;
        this.directExchange = directExchange;
        this.pendingReq = null;

        // Incoming cancellation requests may reference non-existing matches. 
        // If these requests are not deleted from the hashmap, they will accumulate over time.
        // To prevent this, we regularly clean up expired cancellation requests from the hashmap.
        const intervalDuration = 1 * 60 * 1000;
        this.cleanupInterval = setInterval(() => this.cleanupExpiredCancellationRequests(), intervalDuration);
    }

    public async consumeMatchRequest(topic: string, difficulty: string): Promise<void> {
        const queueName = `${topic}_${difficulty}`;
        logger.info(`Consuming match requests from queue: ${queueName}`);
        
        await this.channel.consume(queueName, (message) => {
            this.handleMatchRequest(message);
        }, { noAck: true });
    }

    public addCancelRequest(req: CancelRequestWithQueueInfo) {
        this.cancelledMatches.set(req.getMatchId(), req);
        logger.debug("Added cancellation request to consumer: ", JSON.stringify(req));
    }

    public cancelIfPendingRequestCancelled() {
        if (!this.pendingReq) {
            logger.debug("No existing pending request encountered");
            return;
        }
        if (this.isCancelledMatchRequest(this.pendingReq.getMatchId())) {
            this.processCancelRequest(this.pendingReq.getMatchId(), this.pendingReq.getCorrelationId(), 
                this.pendingReq.getQueue())
        }
    }

    private handleMatchRequest(msg: QueueMessage | null): void {
        if (!msg) {
            logger.warn("Received null message in handleMatchRequest");
            return;
        }
        
        logger.debug("Consumer received match request");
        try {
            const req: MatchRequestWithId = this.parseMatchRequest(msg);
            const correlationId: string = msg?.properties.correlationId;
            const replyQueue: string = msg?.properties.replyTo;

            if (this.pendingReq && this.isCancelledMatchRequest(this.pendingReq.getMatchId())) {
                this.processCancelRequest(this.pendingReq.getMatchId(), this.pendingReq.getCorrelationId(),
                    this.pendingReq.getQueue());
                return;
            }

            if (this.isCancelledMatchRequest(req.getMatchId())) {
                this.processCancelRequest(req.getMatchId(), correlationId,
                    replyQueue);
                return;
            }

            this.processMatchRequest(req, replyQueue, correlationId);
        } catch (e) {
            if (e instanceof Error) {
                logger.error(`Error occurred while handling match request: ${e.message}`);
            } else {
                logger.error(`Unexpected error occurred: ${JSON.stringify(e)}`);
            }
        }
    }

    private parseMatchRequest(msg: QueueMessage): MatchRequestWithId {
        const content: string = msg.content.toString();
        if (!content) {
            logger.error("Message content is empty!");
            throw new Error("Message content is empty!");
        }

        logger.debug(`Parsing match request content: ${content}`);
        const jsonObject = JSON.parse(content);
        logger.debug(`Parsed JSON object: ${JSON.stringify(jsonObject)}`);

        return new MatchRequestWithId(jsonObject.userId, jsonObject.matchId, jsonObject.topic, jsonObject.difficulty);
    }

    private processMatchRequest(incomingReq: MatchRequestWithId, replyQueue: string, correlationId: string): void {
        logger.debug(`Processing match request: ${incomingReq.getMatchId()}`);

        if (!this.pendingReq) {
            this.pendingReq = MatchRequestWithQueueInfo.createFromMatchRequestWithId(incomingReq, replyQueue, correlationId);
            logger.debug(`Stored pending request: ${incomingReq.getMatchId()}`);
            return;
        }

        var incomingReqWithQueueInfo: MatchRequestWithQueueInfo = MatchRequestWithQueueInfo.createFromMatchRequestWithId(incomingReq, replyQueue, correlationId);
        logger.debug(`Matching and responding to requests: ${this.pendingReq.getMatchId()} and ${incomingReq.getMatchId()}`);
        this.matchAndRespond(this.pendingReq, incomingReqWithQueueInfo);
    }

    private matchAndRespond(req1: MatchRequestWithQueueInfo, req2: MatchRequestWithQueueInfo): void {
        logger.debug(`Responding to matched requests: ${req1.getMatchId()} and ${req2.getMatchId()}`);
        
        this.channel.publish(this.directExchange, QueueManager.RESPONSE_QUEUE, Buffer.from(JSON.stringify(req1)), {
            correlationId: req1.getCorrelationId(),
        });
        this.channel.publish(this.directExchange, QueueManager.RESPONSE_QUEUE, Buffer.from(JSON.stringify(req2)), {
            correlationId: req2.getCorrelationId(),
        });

        logger.debug("Responses sent to matched requests");
        this.pendingReq = null;
    }

    private processCancelRequest(matchId: string, matchCorrelationId: string, matchReplyQueue: string): void {
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
        this.channel.publish(this.directExchange, matchReplyQueue, Buffer.from(JSON.stringify(false)), {
            correlationId: matchCorrelationId,
        });

        // respond to cancel request
        logger.debug(`Responding to cancel request: ${cancellationResponseQueue.getQueue()}`);
        this.channel.publish(this.directExchange, cancellationResponseQueue.getQueue(), Buffer.from(JSON.stringify(true)), {
            correlationId: cancellationResponseQueue.getCorrelationId(),
        });
        return;
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

    private cleanupExpiredCancellationRequests(): void {
        logger.info("Cleaning expired match cancellation requests");
    
        this.cancelledMatches.forEach((cancelRequest, matchId) => {
            if (cancelRequest.hasExpired()) {
                logger.debug(`Expired cancellation request detected for match ID: ${matchId}`);
    
                // Notify producer that the cancellation request has expired
                this.channel.publish(
                    this.directExchange,
                    cancelRequest.getQueue(),
                    Buffer.from(JSON.stringify({ success: false, error: "Request expired" })),
                    { correlationId: cancelRequest.getCorrelationId() }
                );
    
                logger.debug(`Notified producer of expired cancellation request for match ID: ${matchId}`);
                this.cancelledMatches.delete(matchId);
            }
        });
    }
    
}

export default Consumer;
