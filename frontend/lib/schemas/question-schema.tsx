import { z } from "zod";

export const QuestionSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  complexity: z.string(),
});

export const UserArraySchema = z.array(QuestionSchema);

export type Question = z.infer<typeof QuestionSchema>;
