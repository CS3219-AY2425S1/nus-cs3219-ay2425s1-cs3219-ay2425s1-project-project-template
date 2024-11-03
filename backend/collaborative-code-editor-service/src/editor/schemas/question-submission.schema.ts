import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class QuestionSubmission {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  language: string;

  @Prop()
  submittedBy: string;

  @Prop()
  submittedAt: Date;

  @Prop({ type: Map, of: String })
  testResults?: Map<string, string>;

  @Prop({ default: 'pending' })
  status: 'pending' | 'accepted' | 'rejected';
}

export const QuestionSubmissionSchema = SchemaFactory.createForClass(QuestionSubmission);
