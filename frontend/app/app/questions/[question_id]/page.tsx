import QuestionViewEdit from "@/components/questions/question-view-edit";

export default function UserSettingsPage({
  params,
}: {
  params: { question_id: string };
}) {
  return <QuestionViewEdit questionId={params.question_id} />;
}
