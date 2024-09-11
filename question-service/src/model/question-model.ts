// interface User {
//     id: string;
//     name: string;
//     email: string;
//   }

//   export const users: User[] = [];

import mongoose, { Schema, Document } from "mongoose";
import Counter from "./counter-model";

// Define the schema for a Question
interface QuestionDocument extends Document {
  question_id: number;
  title: string;
  description: string;
  category: string;
  complexity: string;
}

const questionSchema: Schema = new Schema({
  question_id: { type: Number, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  complexity: { type: String, required: true },
});

// Middleware to auto-increment the question_id before saving
questionSchema.pre("save", async function (next) {
  const question = this as any;

  if (question.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "questionId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    question.question_id = counter?.seq;
  }

  next();
});

export default mongoose.model<QuestionDocument>("Question", questionSchema);
