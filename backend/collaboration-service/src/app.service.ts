import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';
import { CodeChangeEvent } from './interfaces';
import { appendCodeChangeEvent, readEventsForRoom } from './event-handler';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CollabSession } from './schema/collab-session.schema';

@Injectable()
export class AppService {
  constructor(
    private readonly redisService: RedisService,
    @InjectModel('CollabSession')
    private readonly sessionModel: Model<CollabSession>,
  ) {}

  async processCodeChange(
    roomId: string,
    userId: string,
    code: string,
  ): Promise<void> {
    const event: CodeChangeEvent = {
      id: uuidv4(),
      roomId,
      userId,
      code,
      timestamp: new Date(),
    };
    await appendCodeChangeEvent(event);

    // Optionally, publish the code change to a real-time channel
    console.log(`Code change event appended for room ${roomId}`);
  }

  async getCodeChangesForRoom(roomId: string): Promise<CodeChangeEvent[]> {
    return readEventsForRoom(roomId);
  }

  async processAddUserToRoom(roomId: string, userId: string): Promise<void> {
    this.redisService.addUserToRoom(roomId, userId);
    
    let session = await this.sessionModel.findOne({ roomId }).exec();

    if (!session) {
      session = new this.sessionModel({
        roomId,
        userIds: [userId],
      });
      await session.save();
    } else {
      // If user already exists in the session, do nothing (likely rejoined)
      const userExists = session.userIds.some((id) => id === userId);
      if (userExists) {
        return;
      }
      // else, add the user to the session
      await this.sessionModel.updateOne(
        { roomId },
        { $addToSet: { userIds: userId } },
      );
    }
  }

  async processRemoveUserFromRoom(
    roomId: string,
    userId: string,
  ): Promise<void> {
    this.redisService.removeUserFromRoom(roomId, userId);
  }

}
