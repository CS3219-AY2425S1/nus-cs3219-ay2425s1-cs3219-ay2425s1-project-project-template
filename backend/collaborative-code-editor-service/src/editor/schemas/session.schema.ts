import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { QuestionAttempt, QuestionAttemptSchema } from './question-attempt.schema';

@Schema({ timestamps: true })
export class Session {
  @Prop({ required: true, unique: true })
  sessionId: string;

  @Prop({ type: [String], default: [] })
  activeUsers: string[];

  @Prop({ type: [QuestionAttemptSchema] })
  questionAttempts: QuestionAttempt[];

  @Prop({ type: Boolean, default: false })
  isCompleted: boolean;
}

export type SessionDocument = HydratedDocument<Session>;
export const SessionSchema = SchemaFactory.createForClass(Session);