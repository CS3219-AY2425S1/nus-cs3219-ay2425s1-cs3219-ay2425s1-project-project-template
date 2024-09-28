import { z } from 'zod';

export const ExampleSchema = z.object({
  input: z.string(),
  output: z.string(),
});

export const QuestionSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  examples: z.array(ExampleSchema),
  constraints: z.array(z.string()),
  categories: z.array(z.string()),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  link: z.string().url(),
});

export const QuestionsArraySchema = z.array(QuestionSchema);

export type Example = z.infer<typeof ExampleSchema>;
export type Question = z.infer<typeof QuestionSchema>;