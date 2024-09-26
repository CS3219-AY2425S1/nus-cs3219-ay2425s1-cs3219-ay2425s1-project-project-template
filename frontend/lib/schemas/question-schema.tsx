import { z } from "zod";

export const QuestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  complexity: z.string(),
});

export const QuestionArraySchema = z.array(QuestionSchema);

export type Question = z.infer<typeof QuestionSchema>;
