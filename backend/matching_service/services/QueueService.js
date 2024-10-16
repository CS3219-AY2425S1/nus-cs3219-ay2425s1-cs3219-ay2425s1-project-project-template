const TIMEOUT_TIME = require("../utils/CONSTANTS");

class QueueService {
  constructor(pubClient, subClient, connection) {
    this.pubClient = pubClient;
    this.subClient = subClient;
    this.connection = connection;
    this.channel = null;

    // Initialize rabbitmq channel
    this.init();
  }

  async init() {
    try {
      this.channel = await this.connection.createChannel();
    } catch (error) {
      console.error("Failed to establish channel to RabbitMQ: ", error);
    }
  }

  async matchUser(queueName, uid, socketId) {
    console.log(`[QueueService] Attempting to match user ${uid} in queue ${queueName}`);

    // Create or assert the queue with a TTL 
    await this.channel.assertQueue(queueName, {
      durable: true,
      arguments: {
        "x-message-ttl": TIMEOUT_TIME, 
      },
    });

    let message = await this.channel.get(queueName);

    while (message) {
      // Parse the message to retrieve previous user data
      const prevUser = JSON.parse(message.content.toString());
      const prevUserAvailableForMatching = await this.pubClient.get(prevUser.uid);
      const isPrevUserSameAsCurrUser = uid == prevUser.uid; 

      // Check if the previous user is still available for matching
      if (!prevUserAvailableForMatching || isPrevUserSameAsCurrUser) {
        console.log(`User ${prevUser.uid} is not available for matching, consuming message.`);
        this.channel.ack(message); // Acknowledge the message and consume it
        message = await this.channel.get(queueName); // Get the next message
        continue; // Loop to check the next message
      }

      // If the previous user is available, proceed with matching
      console.log(`Matching ${uid} with ${prevUser.uid}`);
      
      // Acknowledge and consume the message for the matched previous user
      this.channel.ack(message);

      const prevUserSessionData = {
        uid: prevUser.uid,
        otherUid: uid,
        socketId: prevUser.socketId,
        otherSocketId: socketId,
      };

      const currUserSessionData = {
        uid: uid,
        otherUid: prevUser.uid,
        socketId: socketId,
        otherSocketId: prevUser.socketId,
      };

      return { prevUserSessionData, currUserSessionData }; 
    }

    // If no messages found, send the current user to the queue
    console.log(`No matching users found. Adding user ${uid} to the queue.`);
    this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify({ uid: uid, socketId: socketId })), { persistent: true });
    return null;
  }

  getQueueName(difficulty, topic) {
    return `${difficulty}_${topic}`;
  }
}

module.exports = { QueueService };
