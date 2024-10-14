class Queue {
  constructor(queueName, difficulty, topic) {
    this.queueName = queueName;
    this.difficulty = difficulty;
    this.topic = topic;
    this.waitingUid = null;
  }

  matchUser(uid) {
    if (!this.waitingUid) {
      console.log(`User ${uid}: Waiting for match...`);
      this.waitingUid = uid;
      return null;
    }

    console.log(`User ${uid} matched with ${this.waitingUid}`);

    const sessionData = this.createSession(this.waitingUid, uid);

    return sessionData;
  }

  removeUser(uid) {
    if (this.waitingUid === uid) {
      console.log(`User ${uid} removed from queue ${this.queueName}.`);
      this.waitingUid = null;
    }

    return null;
  }

  createSession(prevUid, currUid) {
    const questionData = {
      difficulty: this.difficulty,
      topic: this.topic,
    };
    const prevUserSessionData = {
      uid: prevUid,
      otherUid: currUid,
      ...questionData,
    };

    const currUserSessionData = {
      uid: currUid,
      otherUid: prevUid,
      ...questionData,
    };

    return { questionData, prevUserSessionData, currUserSessionData };
  }
}

module.exports = { Queue };
