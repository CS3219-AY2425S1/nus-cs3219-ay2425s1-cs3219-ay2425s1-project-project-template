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
  category: string[];
  complexity: string;
}

const questionSchema: Schema = new Schema({
  question_id: { type: Number, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: [String],
    required: true,
    validate: {
      validator: (v: string[]) => v.length > 0 && v.length <= 3, // Allow up to 3 categories
      message: "A question must have between 1 and 3 categories.",
    },
  },
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

// Add this option to remove __v automatically
questionSchema.set("toJSON", {
  versionKey: false, // This removes the __v field
});

export default mongoose.model<QuestionDocument>("Question", questionSchema);
