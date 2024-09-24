import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const questionSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  categories: z.array(z.string()),
  complexity: z.string(), // 'easy' | 'medium' | 'hard'
});

type Question = z.infer<typeof questionSchema>;

async function fetchQuestions(): Promise<Question> {
  // TODO: Replace placeholder URL with actual API URL
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const data = await response.json();
  return questionSchema.parse(data);
}

export const useQuestions = () => {
  return useQuery<Question, Error>({
    queryKey: ["question"],
    queryFn: fetchQuestions,
  });
};
