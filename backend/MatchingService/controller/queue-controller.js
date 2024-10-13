import { matchingQueue } from "../queue/matching-queue.js";

export async function addUserToQueue(req, res) {
  try {
    const { username, topic, difficulty, questionId } = req.body;
    await matchingQueue.add(
      {
        username,
        topic,
        difficulty,
        questionId,
      },
    );

    return res.status(200).json({ message: "added to queue" });
  } catch (err) {
    console.error("Error adding to queue:", err);
    return res.status(500).json({ error: "Failed to add to queue" });
  }
}

