const { Queue } = require("../utils/Queue");
const { Difficulty } = require("../models/QuestionData");
const { Topic } = require("../models/QuestionData");

class QueueService {
  constructor() {
    /**
     * @type {Map<string, Queue>} queues
     */
    this.queues = new Map();

    // Create a queue for each difficulty and topic pair
    for (const difficulty of Object.values(Difficulty)) {
      for (const topic of Object.values(Topic)) {
        const queueName = this.getQueueName(difficulty, topic);
        const queue = new Queue(queueName, difficulty, topic);
        this.queues.set(queueName, queue);
      }
    }
  }

  matchUser(queueName, uid) {
    console.log(`[QueueService] Matching user ${uid} in queue ${queueName}`);
    const queue = this.queues.get(queueName);

    return queue.matchUser(uid);
  }

  removeUserFromQueue(queueName, uid) {
    const queue = this.queues.get(queueName);

    return queue.removeUser(uid);
  }

  getQueue(queueName) {
    return this.queues.get(queueName);
  }

  getQueueName(difficulty, topic) {
    return `${difficulty}_${topic}`;
  }
}

module.exports = { QueueService };
