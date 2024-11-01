// import {
//   HTTP_SERVICE_QUESTION_HISTORY,
//   SuccessObject,
//   callFunction,
// } from "@/lib/utils";

// export async function getQuestionHistory(): Promise<SuccessObject> {
//   const res = await callFunction(
//     HTTP_SERVICE_QUESTION_HISTORY,
//     "get-question-history"
//   );

//   return res;
// }

import { SuccessObject } from "@/lib/utils";
import { Difficulty, Topic } from "@/models/Question";
import { QuestionHistory } from "@/models/QuestionHistory";

const fakeQuestionHistory: QuestionHistory[] = [
  {
    id: "question1",
    title: "What is the capital of Singapore?",
    description: "Singapore",
    topics: [Topic.Algorithms],
    difficulty: Difficulty.Easy,
    dateCreated: "2021-08-01T00:00:00.000Z",
    examples: [
      {
        input: "Singapore",
        output: "Singapore",
      },
    ],
    constraints: ["Singapore"],
    dateAttempted: "2021-08-01T00:00:00.000Z",
    attempt: "Singapore",
  },
  {
    id: "question2",
    title: "What is the capital of Malaysia?",
    description: "Kuala Lumpur",
    topics: [Topic.Algorithms],
    difficulty: Difficulty.Easy,
    dateCreated: "2021-08-01T00:00:00.000Z",
    examples: [
      {
        input: "Kuala Lumpur",
        output: "Kuala Lumpur",
      },
    ],
    constraints: ["Kuala Lumpur"],
    dateAttempted: "2023-08-01T00:00:00.000Z",
    attempt: "Kuala Lumpur",
  },
];

export async function getQuestionHistory(): Promise<SuccessObject> {
  const res = { success: true, data: fakeQuestionHistory };

  return res;
}
