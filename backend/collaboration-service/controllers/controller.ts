import { Request, Response } from "express";
import { MatchModel } from "../models/match";
import { SessionModel } from "../models/session";

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

// Get History Handler
export const getHistoryHandler = async (req: Request, res: Response): Promise<void> => {
  res.setHeader("Content-Type", "application/json");
  const username = req.query.username as string;

  if (!username) {
    res.status(400).json({ error: "Missing username" });
    return;
  }

  try {
    // Find sessions where the user is either userOne or userTwo, sorted by createdAt
    const sessions = await SessionModel.find({
      $or: [{ userOne: username }, { userTwo: username }]
    }).sort({ createdAt: -1 }).exec();

    res.json(sessions);
  } catch (error) {
    console.error("Error retrieving history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Save Code Handler
export const saveCodeHandler = async (req: Request, res: Response): Promise<void> => {
  res.setHeader("Content-Type", "application/json");

  const { roomId, code } = req.body;
  if (!roomId || !code) {
    res.status(400).json({ error: "Missing roomId or code" });
    return;
  }

  try {
    // Check if a session already exists with the same room_id
    const existingSession = await SessionModel.findOne({ room_id: roomId }).exec();
    if (existingSession) {
      // If session exists, do nothing and return success message
      res.json({ message: "Code saved successfully", session: existingSession });
      return;
    }

    // Retrieve the match associated with the roomId if no session exists
    const match = await MatchModel.findOne({ room_id: roomId }).exec();
    if (!match) {
      res.status(404).json({ error: "Match not found" });
      return;
    }

    // Create and save the session document with code and match data
    const newSession = new SessionModel({
      userOne: match.userOne,
      userTwo: match.userTwo,
      room_id: roomId,
      code,
      question: match.question,
      createdAt: new Date(),
    });

    await newSession.save();
    res.json({ message: "Code saved successfully", session: newSession });
  } catch (error) {
    console.error("Error saving code:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};