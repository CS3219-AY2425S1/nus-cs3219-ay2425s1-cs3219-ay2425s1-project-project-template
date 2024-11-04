import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { QuestionAttempt, QuestionAttemptSchema } from './question-attempt.schema';

interface TestResult {
  testCaseNumber: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  error?: string;
  compilationError?: string | null;
}

interface ExecutionResults {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  testResults: TestResult[];
}

@Schema({ timestamps: true })
export class Session {
  @Prop({ required: true, unique: true })
  sessionId: string;

  @Prop({ type: [String], default: [] })
  activeUsers: string[];

  @Prop({ type: [String], default: [] })
  allUsers: string[];

  @Prop({ type: [QuestionAttemptSchema] })
  questionAttempts: QuestionAttempt[];

  @Prop({ type: Boolean, default: false })
  isCompleted: boolean;

  @Prop({
    type: {
      totalTests: { type: Number, required: true },
      passedTests: { type: Number, required: true },
      failedTests: { type: Number, required: true },
      testResults: [{
        testCaseNumber: { type: Number, required: true },
        input: { type: String, required: true },
        expectedOutput: { type: String, required: true },
        actualOutput: { type: String, required: true },
        passed: { type: Boolean, required: true },
        error: { type: String },
        compilationError: { type: String }
      }]
    },
    _id: false, 
    default: null
  })
  executionResults: ExecutionResults;
}

export type SessionDocument = HydratedDocument<Session>;
export const SessionSchema = SchemaFactory.createForClass(Session);