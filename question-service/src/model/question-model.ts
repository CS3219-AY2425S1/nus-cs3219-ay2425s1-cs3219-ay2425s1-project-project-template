// interface User {
//     id: string;
//     name: string;
//     email: string;
//   }

//   export const users: User[] = [];

import mongoose, { Schema, Document } from "mongoose";

// Define the schema for a Question
interface QuestionDocument extends Document {
  title: string;
  description: string;
  category: string;
  complexity: string;
}

const questionSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  complexity: { type: String, required: true },
});

export default mongoose.model<QuestionDocument>("Question", questionSchema);
