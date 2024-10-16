import redisClient from "../config/redisConfig";
import { User } from "../types";

// Store user in Redis using async/await
export const storeUser = async (user: User): Promise<string | null> => {
  try {
    // Store the user in Redis, Redis 4.x+ returns a Promise, no need for callbacks
    const reply = await redisClient.set(user._id, JSON.stringify(user));
    console.log("User stored in Redis:", reply);
    return reply;
  } catch (err) {
    console.error("Redis set error:", err);
    throw err;
  }
};

export const storeUserToKey = async (
  key: string,
  user: User,
): Promise<number | null> => {
  console.log(`Storing user in key: ${key} for user: ${JSON.stringify(user)}`);
  return redisClient.zAdd(key, [
    { score: Date.now(), value: JSON.stringify(user) },
  ]);
};

export const removeUserFromKey = async (
  key: string,
  user: string,
): Promise<number | null> => {
  console.log(`Removing user from: ${key} for user: ${user}`);
  return redisClient.zRem(key, user);
};

export const transferToDifficultyQueue = async (user: User): Promise<void> => {
  const difficultyKey = `difficulty:${user.difficulty}`;
  const res = await storeUserToKey(difficultyKey, user);
  if (res === null) {
    console.error(
      `Error storing user in difficulty queue for difficulty: ${user.difficulty}`,
    );
  }
};

export const transferToTopicQueue = async (user: User): Promise<void> => {
  const topicKey = `topic:${user.topic}`;
  const res = await storeUserToKey(topicKey, user);
  if (res === null) {
    console.error(`Error storing user in topic queue for topic: ${user.topic}`);
  }
};
