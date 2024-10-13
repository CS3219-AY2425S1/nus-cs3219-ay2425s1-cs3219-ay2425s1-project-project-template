import { matchingQueue } from "../queue/matching-queue.js";

export async function addUserToQueue(req, res) {
  try {
    console.log("req.body", req.body);
    const { username, topic, difficulty, questionId } = req.body;
    await matchingQueue.add({
      username,
      topic,
      difficulty,
      questionId,
    });
    console.log("added to queue");
    return res.status(200).json({ message: "added to queue" });
  } catch (err) {
    console.log("err", err);
  }
}
