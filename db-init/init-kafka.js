const { Kafka } = require('kafkajs');

const kafka = new Kafka({ brokers: ['kafka:9092'] });
const admin = kafka.admin();

async function createTopicIfNotExists(topicName, partitionCount) {
  await admin.connect();

  const topics = await admin.listTopics();
  if (!topics.includes(topicName)) {
    await admin.createTopics({
      topics: [{ topic: topicName, numPartitions: partitionCount, replicationFactor: 1 }],
    });
    console.log(`Topic ${topicName} created`);
  } else {
    console.log(`Topic ${topicName} already exists`);
  }

  await admin.disconnect();
}

// Create Topics for matchmaking events
createTopicIfNotExists('match-events', 3);
createTopicIfNotExists('cancel-match-events', 3);
createTopicIfNotExists('match-found-events', 3);
createTopicIfNotExists('dequeue-events', 3);
