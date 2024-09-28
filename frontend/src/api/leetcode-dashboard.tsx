import { QuestionDifficulty, QuestionMinified } from "@/types/find-match";

const QUESTION_SERVICE = process.env.NEXT_PUBLIC_QUESTION_SERVICE;

export const getLeetcodeDashboardData = async () => {
  const url = `${QUESTION_SERVICE}/all`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  return data;
}
