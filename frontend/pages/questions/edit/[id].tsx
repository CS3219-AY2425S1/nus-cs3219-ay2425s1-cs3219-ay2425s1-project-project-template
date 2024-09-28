import DefaultLayout from "@/layouts/default";
import QuestionForm from "@/components/forms/QuestionForm";
import { useGetQuestion } from "@/hooks/questions";
import { useRouter } from "next/router";

const EditQuestionsPage = () => {
  const router = useRouter();
  const { id } = router.query; // Extract questionId from the query parameters

  // Fetch the question using useGetQuestion hook
  const { data: question, isLoading, error } = useGetQuestion(id as string);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading question. Please try again later.</p>;
  }

  if (!question) {
    return <p>Question not found.</p>;
  }

  return (
    <DefaultLayout>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-4xl p-4 border-solid border-2 rounded-lg">
          <QuestionForm formType="Edit" />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default EditQuestionsPage;
