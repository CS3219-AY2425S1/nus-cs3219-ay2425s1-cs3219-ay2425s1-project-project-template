import { z } from "zod";

export const createQuestionSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    category: z.string().min(1),
    complexity: z.number().min(1).max(5),
  })
  .required();

export type CreateQuestionDto = z.infer<typeof createQuestionSchema>;
