import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';


export type QuestionSubmissionDocument = HydratedDocument<QuestionSubmission>;

@Schema({ collection: 'questionhistories', timestamps: true })
export class QuestionSubmission {
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

export const QuestionHistorySchema = SchemaFactory.createForClass(QuestionSubmission);