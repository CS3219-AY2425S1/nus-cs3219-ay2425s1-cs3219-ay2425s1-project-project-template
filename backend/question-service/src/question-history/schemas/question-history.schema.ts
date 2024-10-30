import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';


export type QuestionHistoryDocument = HydratedDocument<QuestionHistory>;

@Schema({ collection: 'questionhistories', timestamps: true })
export class QuestionHistory {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Session', required: true })
  sessionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Question', required: true })
  questionId: Types.ObjectId;

  @Prop({ required: true })
  attemptDate: Date;

  @Prop({ required: true })
  attemptCode: String;

  @Prop({ type: [Boolean], required: true })
  testCasesPassed: Boolean[];
}

export const QuestionHistorySchema = SchemaFactory.createForClass(QuestionHistory);