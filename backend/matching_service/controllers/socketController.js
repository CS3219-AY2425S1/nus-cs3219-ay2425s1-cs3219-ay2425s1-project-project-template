const { QueueService } = require("../services/QueueService");
const TIMEOUT_TIME = require("../utils/CONSTANTS");

class SocketController {
  constructor(io, pubClient, subClient, connection) {
    this.io = io;
    this.pubClient = pubClient;
    this.subClient = subClient;
    this.queueService = new QueueService(pubClient, subClient, connection);
  }

  handleConnection(socket) {
    socket.on("startMatching", (data) =>
      this.handleStartMatching(socket, data)
    );

    socket.on("joinRoom", (uid, room) => this.handleJoinRoom(socket, uid, room));

    socket.on("cancelMatching", (uid) => this.handleCancelMatching(uid));

    socket.on("disconnect", () => this.handleDisconnect(socket));
  }

  async handleStartMatching(socket, { uid, difficulty, topic }) {
    await this.emitIfDoubleMatchingRequest(uid); // Emit event if double matching requests from same user
    await this.removeExistingConnection(uid); // Remove any existing connections for this user

    // Set a timeout for matching
    setTimeout(() => this.handleTimeout(socket, uid), TIMEOUT_TIME);

    try {
      // Get all questions for a certain topic and difficulty
      const questions = await this.getAllQuestionsOfTopicAndDifficulty(
        socket.handshake.auth.token,
        topic[0],
        difficulty[0]
      );
      
      // Alert user and stop matching if requested question type does not exist in database
      if (!Array.isArray(questions) || questions.length === 0) {
        socket.emit(
          "noQuestionsFound",
          "No questions available for the selected topic and difficulty. Please choose another."
        );
        socket.disconnect();
        return; // Exit the function if no questions are found
      }
    } catch (error) {
      console.error(error);
      socket.emit(
        "error",
        "An error occurred while fetching questions. Please try again later."
      );
      socket.disconnect();
      return;
    }

    const queueName = this.queueService.getQueueName(difficulty, topic);
    // Add user to redis
    await this.pubClient.set(uid, socket.id);

    const sessionData = await this.queueService.matchUser(queueName, uid, socket.id);
    // If found other user in queue
    if (sessionData) {
      this.handleMatching(socket, sessionData, difficulty[0], topic[0]); // Proceed to handleMatching if found 2 users
    }
  }

  async handleMatching(currUserSocket, sessionData, difficulty, topic) {
    const { prevUserSessionData, currUserSessionData } = sessionData;
    const token = currUserSocket.handshake.auth.token;

    const prevUserSocketId = prevUserSessionData.socketId;

    try {
      const questions = await this.getAllQuestionsOfTopicAndDifficulty(
        token,
        topic,
        difficulty
      );

      // Alert user if database does not contain the requested question type
      if (!Array.isArray(questions) || questions.length === 0) {
        this.io.to(prevUserSocketId).emit(
          "noQuestionsFound",
          "No questions available for the selected topic and difficulty. Please choose another."
        );
        currUserSocket.emit(
          "noQuestionsFound",
          "No questions available for the selected topic and difficulty. Please choose another."
        );
        this.removeExistingConnection(prevUserSessionData.uid);
        this.removeExistingConnection(currUserSessionData.uid);
        return; // Exit the function if no questions are found
      }

      // Select a random question from the returned questions
      const randomIndex = Math.floor(Math.random() * questions.length);
      const randomQuestion = questions[randomIndex];

      const roomId = currUserSessionData.uid;

      // Emit matched to both users
      this.io.to(prevUserSocketId).emit("matched", {
        sessionData: prevUserSessionData,
        questionData: randomQuestion,
        roomId: roomId,
      });
      currUserSocket.emit("matched", {
        sessionData: currUserSessionData,
        questionData: randomQuestion,
        roomId: roomId,
      });

      // Logic for collab service: collabService(this.io, roomId) etc
      // this.io.to(roomId).emit(...)
    } catch (error) {
      console.error(error);
      this.io.to(prevUserSocketId).emit(
        "error",
        "An error occurred while handling matching. Please try again later."
      );
      currUserSocket.emit(
        "error",
        "An error occurred while handling matching. Please try again later."
      );
    } finally {
      // Remove existing connections
      // this.removeExistingConnection(prevUserSessionData.uid);
      // this.removeExistingConnection(currUserSessionData.uid);
    }
  }

  handleJoinRoom(socket, uid, room) {
    socket.join(room);
    console.log(`User ${uid} joined room: ${room}`);
    this.removeExistingConnection(uid); // To be removed when collab service is in place
  }

  handleCancelMatching(uid) {
    this.removeExistingConnection(uid);
  }

  handleTimeout(socket, uid) {
    if (!socket.disconnected) {
      socket.emit(
        "matchmakingTimedOut",
        `Matchmaking timed out after ${TIMEOUT_TIME / 1000}s`
      );
      console.log(`${uid}} timed out after ${TIMEOUT_TIME / 1000}s`);

      this.removeExistingConnection(uid);
    }
  }

  async handleDisconnect(socket) {
    await this.removeExistingConnection(socket.handshake.auth.uid); // uid is passed in socket auth from frontend
  }

  async emitIfDoubleMatchingRequest(uid) {
    const socketId = await this.pubClient.get(uid); // Retrieve data from Redis
    if (!socketId) return;

    this.io.to(socketId).emit(
      "doubleMatchingRequest",
      "Double matching request detected, stopping current tab's matching request"
    );
  }

  async removeExistingConnection(uid) {
    console.log(`Removing (any) existing connection for user: ${uid}`);

    const socketId = await this.pubClient.get(uid);
    if (!socketId) return;

    // Remove the entry from Redis
    await this.pubClient.del(uid); // Delete the redis entry for this uid

    this.io.to(socketId).emit("DisconnectSocket");
  }

  async getAllQuestionsOfTopicAndDifficulty(token, topic, difficulty) {
    const questionServiceTopicAndDifficultyBackendUrl =
      process.env.QUESTION_SERVICE_TOPIC_AND_DIFFICULTY_BACKEND_URL ||
      "http://localhost:5002/get-questions-of-topic-and-difficulty";

    const response = await fetch(questionServiceTopicAndDifficultyBackendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: topic,
        difficulty: difficulty,
      }),
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(
        `Error fetching questions: ${response.status} ${response.statusText}`
      );
    }

    const questions = await response.json();
    return questions;
  }
}

module.exports = { SocketController };
