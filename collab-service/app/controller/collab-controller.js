import {
  newRoom,
  getRoomId,
  heartbeat,
  getAllRooms,
} from "../model/repository.js";
import crypto from "crypto";

// Create a room between two users
export async function createRoom(req, res) {
  const { user1, user2 } = req.body;

  if (!user1 || !user2) {
    return res.status(400).json({ error: "Both user1 and user2 are required" });
  }

  // Generate a unique room ID by hashing the two user IDs
  const roomId = crypto
    .createHash("sha256")
    .update(user1 + user2)
    .digest("hex");
  const room = await newRoom(user1, user2, roomId);

  if (room) {
    res.status(201).json(room);
  } else {
    res.status(500).json({ error: "Failed to create room" });
  }
}

// Get room ID by user
export async function getRoomByUser(req, res) {
  const { user } = req.params;

  if (!user) {
    return res.status(400).json({ error: "User is required" });
  }

  const room = await getRoomId(user);

  if (room) {
    res.status(200).json(room);
  } else {
    res.status(404).json({ error: `Room not found for user: ${user}` });
  }
}

// Update heartbeat for a room
export async function updateHeartbeat(req, res) {
  const { roomId } = req.params;

  if (!roomId) {
    return res.status(400).json({ error: "Room ID is required" });
  }

  const updatedRoom = await heartbeat(roomId);

  if (updatedRoom) {
    res.status(200).json(updatedRoom);
  } else {
    res.status(404).json({ error: `Room with ID ${roomId} not found` });
  }
}

// Get all rooms
export async function getAllRoomsController(req, res) {
  const rooms = await getAllRooms();

  if (rooms) {
    res.status(200).json(rooms);
  } else {
    res.status(500).json({ error: "Failed to retrieve rooms" });
  }
}
