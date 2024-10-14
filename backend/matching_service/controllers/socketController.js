const { QueueService } = require("../services/QueueService");
const TIMEOUT_TIME = 30000;

class SocketController {
  constructor() {
    this.socketMap = new Map();
    this.queueService = new QueueService(this.socketMap);
  }

  handleConnection(socket) {
    socket.on("startMatching", (data) =>
      this.handleStartMatching(socket, data)
    );

    socket.on("cancelMatching", (uid) => this.handleCancelMatching(uid));

    socket.on("disconnect", () => this.handleDisconnect(socket));
  }

  async handleStartMatching(socket, { uid, difficulty, topic }) {
    this.emitIfDoubleMatchingRequest(uid); // Handles edge case whereby user starts matching from two different sessions simultaneously
    this.removeExistingConnection(uid); // Remove any existing connections for this user

    // Alert user if database does not contain the requested question type
    console.log(topic[0]);
    console.log(difficulty[0]);

    // Set a timeout for matching
    setTimeout(() => this.handleTimeout(socket, uid), TIMEOUT_TIME);

    try {
      const questions = await this.getAllQuestionsOfTopicAndDifficulty(
        socket.handshake.auth.token,
        topic[0],
        difficulty[0]
      );

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

    // Add the socket to the map
    const queueName = this.queueService.getQueueName(difficulty, topic);
    this.socketMap.set(uid, { socket, queueName });

    const sessionData = this.queueService.matchUser(queueName, uid);
    if (sessionData) this.handleMatching(sessionData); // Proceed to handleMatching if found 2 users
  }

  handleCancelMatching(uid) {
    this.removeExistingConnection(uid);
  }

  async handleMatching(sessionData) {
    const { questionData, prevUserSessionData, currUserSessionData } =
      sessionData;

    const prevUserSocket = this.socketMap.get(prevUserSessionData.uid).socket;
    const currUserSocket = this.socketMap.get(currUserSessionData.uid).socket;

    const token = currUserSocket.handshake.auth.token;
    const { difficulty, topic } = questionData;

    try {
      const questions = await this.getAllQuestionsOfTopicAndDifficulty(
        token,
        topic,
        difficulty
      );

      // Alert user if database does not contain the requested question type
      if (!Array.isArray(questions) || questions.length === 0) {
        prevUserSocket.emit(
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

      // Emit matched to both users
      prevUserSocket.emit("matched", {
        sessionData: prevUserSessionData,
        questionData: randomQuestion,
      });
      currUserSocket.emit("matched", {
        sessionData: currUserSessionData,
        questionData: randomQuestion,
      });
    } catch (error) {
      console.error(error);

      prevUserSocket.emit(
        "error",
        "An error occurred while fetching questions. Please try again later."
      );
      currUserSocket.emit(
        "error",
        "An error occurred while fetching questions. Please try again later."
      );
    } finally {
      // Remove existing connections
      this.removeExistingConnection(prevUserSessionData.uid);
      this.removeExistingConnection(currUserSessionData.uid);
    }
  }

  handleTimeout(socket, uid) {
    if (!socket.disconnected) {
      socket.emit(
        "matchmakingTimedOut",
        `Matchmaking timed out after ${TIMEOUT_TIME / 1000}s`
      );
      console.log(`timed out after ${TIMEOUT_TIME / 1000}s`);

      this.removeExistingConnection(uid);
    }
  }

  handleDisconnect(socket) {
    const uid = this.findUidBySocket(socket);

    if (uid) {
      this.removeExistingConnection(uid);
    }
  }

  emitIfDoubleMatchingRequest(uid) {
    const socketData = this.socketMap.get(uid);
    if (!socketData) return;

    const { socket, queueName } = socketData;
    socket.emit(
      "doubleMatchingRequest",
      "Double matching request detected, stopping current tab's matching request"
    );
  }

  removeExistingConnection(uid) {
    console.log("Removing Existing Connection for User:", uid);

    const socketData = this.socketMap.get(uid);
    if (!socketData) return;

    const { socket, queueName } = socketData;

    this.queueService.removeUserFromQueue(queueName, uid);
    this.socketMap.delete(uid);

    socket.disconnect();
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

  findUidBySocket(socket) {
    for (const [uid, socketData] of this.socketMap.entries()) {
      if (socketData.socket === socket) {
        return uid;
      }
    }
    return null;
  }
}

module.exports = { SocketController };
