import { Request, Response } from "express";
import { MatchModel } from "../models/match";

// AuthorisedUserHandler checks if a user is authorised to join the room
export const checkAuthorisedUser = async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");

  const userId = req.query.userId as string;
  const roomId = req.query.roomId as string;

  if (!userId || !roomId) {
    return res.status(400).json({ error: "Missing userId or roomId" });
  }

  try {
    // Find the match in the MongoDB collection
    const match = await MatchModel.findOne({ room_id: roomId }).exec();
    if (!match) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check if the user is authorised
    const isAuthorised = match.userOne === userId || match.userTwo === userId;
    return res.json({ authorised: isAuthorised });
  } catch (error) {
    console.error("Error finding room associated with user", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// GetQuestionHandler retrieves the question for a match based on the roomId
export const getQuestionHandler = async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");

  const roomId = req.query.roomId as string;
  if (!roomId) {
    return res.status(400).json({ error: "Missing roomId" });
  }

  try {
    // Find the match in the MongoDB collection
    const match = await MatchModel.findOne({ room_id: roomId }).exec();
    if (!match) {
      return res.status(404).json({ error: "Match not found" });
    }

    // Check if the question exists in the match
    if (!match.question || !match.question.questionId) {
      return res.status(404).json({ error: "No question found for the given roomId" });
    }

    // Return the question as a JSON response
    return res.json(match.question);
  } catch (error) {
    console.error("Error finding match:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
