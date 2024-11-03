import express from "express";
import {
  createRoom,
  getRoomByUser,
  getAllRoomsController,
  getRoomChatHistory,
} from "../controller/collab-controller.js";

const router = express.Router();

router.post("/create-room", createRoom);

router.get("/user/:user", getRoomByUser);

router.get("/rooms", getAllRoomsController);

router.get("/chat-history/:roomId", getRoomChatHistory);

export default router;
