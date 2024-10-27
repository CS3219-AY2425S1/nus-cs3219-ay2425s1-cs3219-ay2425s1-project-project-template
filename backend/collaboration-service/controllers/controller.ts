import { Request, Response } from "express";
import { MatchModel } from "../models/match";

// AuthorisedUserHandler checks if a user is authorised to join the room
export const checkAuthorisedUser = async (req: Request, res: Response): Promise<void> => {
  res.setHeader("Content-Type", "application/json");
  const userId = req.query.userId as string;
  const roomId = req.query.roomId as string;

  if (!userId || !roomId) {
    res.status(400).json({ error: "Missing userId or roomId" });
    return;
  }

  try {
    const match = await MatchModel.findOne({ room_id: roomId }).exec();
    if (!match) {
      res.status(404).json({ error: "Room not found" });
      return;
    }

    const isAuthorised = match.userOne === userId || match.userTwo === userId;
    res.json({ authorised: isAuthorised });
  } catch (error) {
    console.error("Error finding room associated with user", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// GetQuestionHandler retrieves the question for a match based on the roomId
export const getQuestionHandler = async (req: Request, res: Response): Promise<void> => {
  res.setHeader("Content-Type", "application/json");

  const roomId = req.query.roomId as string;
  if (!roomId) {
    res.status(400).json({ error: "Missing roomId" });
    return;
  }

  try {
    // Find the match in the MongoDB collection
    const match = await MatchModel.findOne({ room_id: roomId }).exec();
    if (!match) {
      res.status(404).json({ error: "Match not found" });
      return;
    }

    // Check if the question exists in the match
    if (!match.question || !match.question.questionId) {
      res.status(404).json({ error: "No question found for the given roomId" });
      return;
    }

    // Send the question as a JSON response
    res.json(match.question);
  } catch (error) {
    console.error("Error finding match:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};