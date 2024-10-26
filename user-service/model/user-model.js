import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserModelSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Setting default to the current date/time
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  friends: {
    type: [String], // Array of strings for friend IDs
    default: [],
  },
  friendRequests: {
    type: [String], // Array of strings for friend request IDs
    default: [],
  },
  matchHistory: {
    type: [
      {
        sessionId: { type: String, required: true },
        questionId: { type: String, required: true },
        partnerId: { type: String, required: true },
      },
    ],
    default: [], // Default to an empty array
  },
});

export default mongoose.model("UserModel", UserModelSchema);
