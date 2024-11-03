import { z } from "zod";

const ChatMessageStatusEnum = z.enum(["sending", "failed", "sent"]);

const ChatMessageSchema = z.object({
  userId: z.string(),
  message: z.string(),
  status: ChatMessageStatusEnum,
  timestamp: z.string().datetime(),
});

type ChatMessageStatus = z.infer<typeof ChatMessageStatusEnum>;

type ChatMessage = z.infer<typeof ChatMessageSchema>;

export {
  ChatMessageStatusEnum,
  ChatMessageSchema,
  type ChatMessageStatus,
  type ChatMessage,
};
