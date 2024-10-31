import { z } from "zod";
import { createResponseSchema } from "./Response";

export const CodeReviewSchema = z.object({
  header: z.string(),
  body: z.string(),
});

export const CodeReviewResponseSchema =
  createResponseSchema(CodeReviewSchema);

export type CodeReview = z.infer<typeof CodeReviewSchema>;

export type CodeReviewResponse = z.infer<typeof CodeReviewResponseSchema>;
