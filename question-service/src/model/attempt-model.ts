// model/attempt-model.ts

import mongoose from "mongoose";

const AttemptSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "QuestionModel",
    required: true,
  },
  peerUserName: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["Attempted", "Completed"],
    default: "Attempted",
  },
  timestamp: { 
    type: Date,
    default: Date.now,
  },
});

// To prevent duplicates, consider adding a compound index
// AttemptSchema.index({ userId: 1, questionId: 1, peerUserName: 1 }, { unique: false });

export default mongoose.model("AttemptModel", AttemptSchema);
