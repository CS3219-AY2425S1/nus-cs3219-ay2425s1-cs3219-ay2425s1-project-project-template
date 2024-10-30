import { useQuery } from "@tanstack/react-query";
import { Question, QuestionsArraySchema } from "../types/question";
import { getToken } from "@/lib/utils";

async function fetchQuestions(): Promise<Question[]> {
  const token = getToken();
  const response = await fetch("http://localhost:8080/api/question/questions", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();

  return data;

  return QuestionsArraySchema.parse(data);
}

export function useQuestions() {
  return useQuery<Question[], Error>({
    queryKey: ["questions"],
    queryFn: fetchQuestions,
  });
}

async function fetchQuestionCategories(): Promise<string[]> {
  const token = getToken();
  const response = await fetch(
    "http://localhost:8080/api/question/categories",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();

  return data;
}

export function useQuestionCategories() {
  return useQuery<string[], Error>({
    queryKey: ["questionCategories"],
    queryFn: fetchQuestionCategories,
  });
}
