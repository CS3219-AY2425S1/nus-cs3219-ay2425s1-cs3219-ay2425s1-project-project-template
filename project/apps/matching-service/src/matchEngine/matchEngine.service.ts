import { Inject, Injectable, Logger } from '@nestjs/common';
import { MatchExpiryProducer } from './matchEngine.produceExpiry';
import { MatchRedis } from 'src/db/match.redis';
import { MatchSupabase } from 'src/db/match.supabase';
import { MatchingGateway } from 'src/matching.gateway';
import {
  MatchDataDto,
  MatchRequestDto,
} from '@repo/dtos/match';
import { CollabDto, CollabRequestDto } from '@repo/dtos/collab';
import { MATCH_TIMEOUT } from 'src/constants/queue';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MatchEngineService {
  private readonly logger = new Logger(MatchEngineService.name);
  constructor(
    private readonly matchEngineProduceExpiry: MatchExpiryProducer,
    private readonly matchRedis: MatchRedis,
    private readonly matchSupabase: MatchSupabase,
    private readonly matchGateway: MatchingGateway,
    @Inject('COLLABORATION_SERVICE')
    private readonly collabServiceClient: ClientProxy,
  ) {}

  /**
   * Generates a match for the user based on the match request.
   * If a match is found, the match data is saved to the database.
   * If no match is found, the match request is added to the matching queue with an expiry time.
   * @param matchRequest MQ message containing user id, array of categories and complexity to match
   * @returns
   */

  async generateMatch(matchRequest: MatchRequestDto) {
    const { userId, category, complexity } = matchRequest;

    const matchedData = await this.matchRedis.findPotentialMatch(
      userId,
      category,
      complexity,
    );

    if (!matchedData) {
      this.logger.log(
        `No immediate match found for user ${userId}, adding to matching queue`,
      );
      // No match found, add the match to redis
      const match_req_id = await this.matchRedis.addMatchRequest(matchRequest);
      if (!match_req_id) {
        throw new Error('Failed to add match request');
      }
      await this.matchEngineProduceExpiry.enqueueMatchExpiryRequest(
        match_req_id,
        MATCH_TIMEOUT,
      );
      return;
    }

    this.logger.log(`Match found for user ${userId} and ${matchedData.userId}`);

    // Find the overlapping categories between both users
    const overlappingCategories = category.filter((value) =>
      matchedData.category.includes(value),
    );

    const matchData: MatchDataDto = {
      user1_id: userId,
      user2_id: matchedData.userId,
      complexity: complexity,
      category: overlappingCategories,
      id: matchedData.matchId,
    };

    this.logger.debug(`Saving match data to DB: ${JSON.stringify(matchData)}`);

    // Obtain the Collab ID from Collaboration-service
    const collabId = await this.createCollab({
      user1_id: matchData.user1_id,
      user2_id: matchData.user2_id,
      complexity: matchData.complexity,
      category: matchData.category,
      match_id: matchData.id,
    });

    // Send match found message containg collabId to both users
    this.matchGateway.sendMatchFound({
      userId: userId,
      message: collabId,
    });

    this.matchGateway.sendMatchFound({
      userId: matchedData.userId,
      message: collabId,
    });
    await this.matchSupabase.saveMatch(matchData);
  }

  async createCollab(collabReqData: CollabRequestDto) {
    const collabId: string = await firstValueFrom(
      this.collabServiceClient.send({ cmd: 'create_collab' }, collabReqData),
    );
    return collabId;
  }
}
