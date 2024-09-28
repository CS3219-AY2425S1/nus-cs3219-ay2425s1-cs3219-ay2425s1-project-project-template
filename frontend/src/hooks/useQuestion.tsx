import { useQuery } from '@tanstack/react-query';
import { Question, QuestionSchema } from '../types/question';

async function fetchQuestion(id: number): Promise<Question> {
  const response = await fetch(`http://localhost:8080/api/questions/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return QuestionSchema.parse(data);
}

export function useQuestion(id: number) {
  return useQuery<Question, Error>({
    queryKey: ['question', id],
    queryFn: () => fetchQuestion(id),
  });
}