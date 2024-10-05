import { EventEmitter } from 'events';
import { MatchRequest, UserMatch } from '../utils/types';
import { config } from '../utils/config';
import logger from '../utils/logger';

export class MatchController extends EventEmitter {
    private waitingUsers: Map<string, MatchRequest>;
    private matchTimeouts: Map<string, NodeJS.Timeout>;

    constructor() {
        super();
        this.waitingUsers = new Map();
        this.matchTimeouts = new Map();
    }

    addToMatchingPool(userId: string, request: MatchRequest): void {
        this.waitingUsers.set(userId, request);
        
        const timeout = setTimeout(() => {
            this.removeFromMatchingPool(userId);
            this.emit('match-timeout', userId);
            logger.info(`Match timeout for user ${userId}`);
        }, config.matchTimeout);
        
        this.matchTimeouts.set(userId, timeout);
        
        this.tryMatch(userId);
    }

    removeFromMatchingPool(userId: string): void {
        this.waitingUsers.delete(userId);
        const timeout = this.matchTimeouts.get(userId);
        if (timeout) {
            clearTimeout(timeout);
            this.matchTimeouts.delete(userId);
        }
    }

    private tryMatch(userId: string): void {
        const userRequest = this.waitingUsers.get(userId);
        if (!userRequest) return;

        for (const [potentialMatchId, potentialMatchRequest] of this.waitingUsers.entries()) {
            if (potentialMatchId !== userId && 
                this.isCompatibleMatch(userRequest, potentialMatchRequest)) {
                
                const match: UserMatch = {
                    difficultyLevel: userRequest.difficultyLevel,
                    category: userRequest.category
                };

                this.removeFromMatchingPool(userId);
                this.removeFromMatchingPool(potentialMatchId);

                this.emit('match-success', {
                    user1Id: userId,
                    user2Id: potentialMatchId,
                    match
                });
                
                logger.info(`Match found between ${userId} and ${potentialMatchId}`, { match });
                return;
            }
        }
    }

    private isCompatibleMatch(request1: MatchRequest, request2: MatchRequest): boolean {
        return request1.difficultyLevel === request2.difficultyLevel &&
               request1.category === request2.category;
    }
}