import { Schema, model, Types } from "mongoose";

// Define the Session Schema
const SessionSchema = new Schema({
  userOne: { type: String, required: true },
  userTwo: { type: String, required: true },
  room_id: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  question: { type: Types.ObjectId, ref: "Question", required: true }, 
  createdAt: { type: Date, default: Date.now }
});

// Create the Session model
export const SessionModel = model("Session", SessionSchema);