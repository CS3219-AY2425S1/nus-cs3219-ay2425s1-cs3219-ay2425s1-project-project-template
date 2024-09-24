import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

@Schema({ collection: 'questions' })
export class Question {
  @Prop({ required: true })
  questionId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: [String] })
  categories: string[];

  @Prop({ required: true })
  complexity: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
