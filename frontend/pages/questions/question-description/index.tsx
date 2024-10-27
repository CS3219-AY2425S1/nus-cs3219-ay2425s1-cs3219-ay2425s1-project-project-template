import { useRouter } from "next/router";

import { useGetQuestion } from "@/hooks/api/questions";
import QuestionDescription from "@/components/questions/QuestionDescription";

export default function QuestionDescriptionPage() {
  const router = useRouter();
  const { id: questionId } = router.query;
  const idString: string = (
    Array.isArray(questionId) ? questionId[0] : questionId
  ) as string;
  const { data: question, isLoading, isError } = useGetQuestion(idString);

  return isLoading ? (
    <h1>fetching question</h1>
  ) : isError || !question ? (
    <p>Error fetching Question</p>
  ) : (
    <QuestionDescription isCollab={false} question={question} />
  );
}
