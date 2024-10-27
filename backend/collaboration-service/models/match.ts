import { Schema, model } from "mongoose";


// Interface for Question document
export interface Question {
  questionId: string;
  title: string;
  description: string;
  constraints: string;
  examples: string;
  category: string[];
  complexity: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for Match document (similar to Pair)
export interface Match {
  userOne: string;
  userTwo: string;
  room_id: string;
  complexity: string[];
  categories: string[];
  question: Question; // Single Question object
}

// Mongoose schema for the Question model
const questionSchema = new Schema<Question>({
  questionId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: false },
  constraints: { type: String, required: false },
  examples: { type: String, required: false },
  category: [{ type: String, required: false }],
  complexity: { type: String, required: false },
  imageUrl: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Mongoose schema for the Match model, embedding a single Question
const matchSchema = new Schema<Match>({
  userOne: { type: String, required: true },
  userTwo: { type: String, required: true },
  room_id: { type: String, required: true },
  complexity: { type: [String], required: true },
  categories: { type: [String], required: true },
  question: { type: questionSchema, required: true }, // Embedded single Question document
});

// Create models from schemas
export const QuestionModel = model<Question>("Question", questionSchema);
export const MatchModel = model<Match>("Match", matchSchema);

