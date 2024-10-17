import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';
import database from '../config/firebaseConfig';
import { ref, get, set, update } from 'firebase/database';
import { Room } from "../models/room-model";
import { JoinRequest } from '../models/join-request';

export const joinRoom = async (req: Request, res: Response) => {
  try {
    const { roomId, userId } = req.body as JoinRequest;

    if (!roomId || typeof roomId !== 'string') {
      return res.status(400).json({ message: "Invalid or missing roomId." });
    }

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ message: "Invalid or missing userId." });
    }

    const roomRef = ref(database, `rooms/${roomId}`);
    const roomSnapshot = await get(roomRef);
    if (!roomSnapshot.exists()) {
      return res.status(404).json({ message: "Room does not exist." });
    }

    const roomData = roomSnapshot.val() as Room;

    if (roomData.status !== 'active') {
      return res.status(403).json({ message: "Room is not active." });
    }

    if (!(userId in roomData.users)) {
      return res.status(403).json({ message: "User is not allowed to join this room." });
    }

    const updatedUsers = {
      ...roomData.users,
      [userId]: true
    };

    await update(roomRef, { users: updatedUsers });

    res.status(200).json({ message: "Joined room successfully.", roomId });
  } catch (error) {
    console.error("Error joining room:", error);
    res.status(500).json({ message: "Failed to join room due to server error." });
  }
};

export const createRoom = async (req: Request, res: Response) => {
  try {
    const {userId1, userId2 } = req.body;

    const roomId = uuidv4();

    const roomRef = ref(database, `rooms/${roomId}`);
    
    // checking if by chance a roomId that already exists is generated
    const roomSnapshot = await get(roomRef);
    if (roomSnapshot.exists()) {
      return res.status(400).json({ message: "Room already exists" });
    }

    const newRoom: Room = {
      roomId: roomId,
      code: "// Enter your code here:",
      users: {
        [userId1]: false,
        [userId2]: false
      },
      createdAt: Date.now(),
      status: 'active'
  };

    await set(roomRef, newRoom);

    res.status(201).json({ message: "Room created successfully", roomId });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ message: "Failed to create room" });
  }
};

export const getRoomData = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    const roomRef = ref(database, `rooms/${id}`);

    const roomSnapshot = await get(roomRef);
    if (!roomSnapshot.exists()) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json(roomSnapshot.val());
  } catch (error) {
    console.error("Error fetching room data:", error);
    res.status(500).json({ message: "Failed to fetch room data" });
  }
};

export const setRoomInactive = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.body;

    if (!roomId || typeof roomId !== 'string') {
      return res.status(400).json({ message: "Invalid roomId." });
    }

    const roomRef = ref(database, `rooms/${roomId}`);

    const roomSnapshot = await get(roomRef);
    if (!roomSnapshot.exists()) {
      return res.status(404).json({ message: "Room does not exist." });
    }

    const roomData = roomSnapshot.val() as Room;

    if (roomData.status === 'inactive') {
      return res.status(400).json({ message: "Room is already inactive." });
    }

    await update(roomRef, { status: 'inactive' });

    res.status(200).json({ message: "Room has been set to inactive.", roomId });
  } catch (error) {
    console.error("Error setting room to inactive:", error);
    res.status(500).json({ message: "Failed to set room status due to server error." });
  }
};
