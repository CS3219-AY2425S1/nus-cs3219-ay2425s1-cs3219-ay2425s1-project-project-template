import { QuestionMinified } from "@/types/find-match";

const QUESTION_SERVICE = process.env.NEXT_PUBLIC_QUESTION_SERVICE;

export const getLeetcodeDashboardData = async (): Promise<
  QuestionMinified[]
> => {
  const url = `${QUESTION_SERVICE}/all`;
  const response = await fetch(url);
  const data = await response.json();
  // console.log(data);
  return data;
};

export const fetchSingleLeetcodeQuestion = async (
  questionId: string
): Promise<any> => {
  const url = `${QUESTION_SERVICE}/${questionId}`;
  const response = await fetch(url);
  const data = await response.json();
  // console.log(data);
  return data;
};
