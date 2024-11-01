import express from "express";
import {
  createRoom,
  getRoomByUser,
  updateHeartbeat,
  getAllRoomsController,
} from "../controller/collab-controller.js";

const router = express.Router();

router.post("/create-room", createRoom);

router.get("/user/:user", getRoomByUser);

router.patch("/heartbeat/:roomId", updateHeartbeat);

router.get("/rooms", getAllRoomsController);

export default router;
