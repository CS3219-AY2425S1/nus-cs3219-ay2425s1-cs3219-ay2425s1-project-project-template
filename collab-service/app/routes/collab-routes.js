import express from "express";
import {
  createRoom,
  getRoomByUser,
  getAllRoomsController,
  getRoomChatHistory,
  getQuestionId
} from "../controller/collab-controller.js";

const router = express.Router();

router.post("/create-room", createRoom);

router.get("/user/:user", getRoomByUser);

router.get("/rooms", getAllRoomsController);

router.get("/chat-history/:roomId", getRoomChatHistory);

router.get("/rooms/:roomId/questionId", getQuestionId);

export default router;
