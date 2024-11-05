import { sendAiMessage } from "../model/repository.js";

// send ai message
export async function sendAiMessageController(req, res) {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message content is required" });
  }

  const data = await sendAiMessage(message);
  const aiResponse =
    data.choices?.[0]?.message?.content || "No response from AI";

  if (aiResponse) {
    res.status(200).json({ data });
  } else {
    res.status(500).json({ error: "Failed to retrieve AI response" });
  }
}
