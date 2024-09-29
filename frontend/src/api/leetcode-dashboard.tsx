import {
  QuestionMinified,
  QuestionFull,
  NewQuestionData,
} from "@/types/find-match";

const QUESTION_SERVICE = process.env.NEXT_PUBLIC_QUESTION_SERVICE;

export const createSingleLeetcodeQuestion = async ({
  title,
  description,
  category,
  complexity,
}: NewQuestionData) => {
  const url = `${QUESTION_SERVICE}/create`;
};

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

export const updateSingleLeetcodeQuestion = async ({
  questionId,
  title,
  description,
  category,
  complexity,
}: QuestionFull) => {
  const url = `${QUESTION_SERVICE}/${questionId}/update`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      description: description,
      category: category,
      complexity: complexity,
    }),
  });

  if (!resp.ok) {
    throw new Error("Failed to update the question");
  }

  return await resp.json();
};

export const deleteSingleLeetcodeQuestion = async (questionId: string) => {
  const url = `${QUESTION_SERVICE}/${questionId}/delete`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      questionId: questionId,
    }),
  });

  if (!resp.ok) {
    throw new Error("Failed to update the question");
  }

  return await resp.json();
};
