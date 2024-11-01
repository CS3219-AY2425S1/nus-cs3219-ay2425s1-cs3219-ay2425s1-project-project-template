import { connect, mongoose } from "mongoose";
import UsersSession from "./usersSession-model.js";

export async function connectToMongo() {
  await connect(
    "mongodb+srv://admin:admin_g50_password@cs3219-g50-question-ser.c7loi.mongodb.net/"
  );
}

export async function createRoom(user1, user2, roomId) {
  try {
    const newRoom = new UsersSession({
      users: [user1, user2],
      roomId: roomId,
      lastUpdated: new Date(),
    });

    const savedRoom = await newRoom.save();
    return savedRoom;
  } catch (error) {
    console.error("Error creating room:", error);
    return null;
  }
}

export async function getRoomId(user) {
  try {
    const room = await UsersSession.findOne({ users: user });
    return room;
  } catch (error) {
    console.error("Error finding room for ${user}:", error);
    return null;
  }
}

export async function heartbeat(roomId) {
  try {
    const room = await UsersSession.findOne({ roomId: roomId });
    room.lastUpdated = new Date();
    await room.save();
    return room;
  } catch (error) {
    console.error("Error updating room ${roomId}:", error);
    return null;
  }
}

export async function getAllRooms() {
  try {
    const rooms = await UsersSession.find({});
    return rooms;
  } catch (error) {
    console.error("Error getting all rooms:", error);
    return null;
  }
}

// Function to add a new message to chatHistory with transaction support
export async function addMessageToChat(roomId, userId, text) {
  // Start a session for the transaction
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Find the session document by roomId within the transaction
    const sessionDoc = await UsersSession.findOne({ roomId }).session(session);

    if (!sessionDoc) {
      throw new Error("Room not found");
    }

    // Determine the next message index within the transaction
    const lastMessageIndex =
      sessionDoc.chatHistory.length > 0
        ? sessionDoc.chatHistory[sessionDoc.chatHistory.length - 1].messageIndex
        : -1;

    // Create the new message with incremented messageIndex
    const newMessage = {
      messageIndex: lastMessageIndex + 1,
      userId,
      text,
      timestamp: new Date(),
    };

    // Add the new message to chatHistory within the transaction
    sessionDoc.chatHistory.push(newMessage);

    // Save the document within the transaction
    await sessionDoc.save({ session });

    // Commit the transaction
    await session.commitTransaction();

    // End the session and return the new message
    session.endSession();
    return newMessage;
  } catch (error) {
    // If an error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();
    console.error("Error adding message to chat:", error);
    throw error;
  }
}
