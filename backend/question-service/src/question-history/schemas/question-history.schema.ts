import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';


export type QuestionHistoryDocument = HydratedDocument<QuestionHistory>;

@Schema({ collection: 'questionhistories', timestamps: true })
export class QuestionHistory{
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Question', required: true })
  questionId: Types.ObjectId;

  @Prop({ required: true })
  attemptDate: Date;

  @Prop({ required: true })
  attemptDetails: string;
}

export const QuestionHistorySchema = SchemaFactory.createForClass(QuestionHistory);