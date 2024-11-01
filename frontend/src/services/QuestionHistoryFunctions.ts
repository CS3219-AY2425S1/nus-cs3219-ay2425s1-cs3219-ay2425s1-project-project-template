import {
  HTTP_SERVICE_HISTORY,
  SuccessObject,
  callFunction,
} from "@/lib/utils";

export async function getQuestionHistory(): Promise<SuccessObject> {
  const res = await callFunction(
    HTTP_SERVICE_HISTORY,
    "get-all-attempted-questions",
    "POST",
    { uid: sessionStorage.getItem("uid") }
  );

  return res;
}
