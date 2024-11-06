import {
  HTTP_SERVICE_HISTORY,
  SuccessObject,
  callFunction,
  getUid,
} from "@/lib/utils";

export async function getQuestionHistory(): Promise<SuccessObject> {
  const res = await callFunction(
    HTTP_SERVICE_HISTORY,
    "get-all-attempted-questions",
    "POST",
    { uid: getUid() }
  );

  return res;
}
