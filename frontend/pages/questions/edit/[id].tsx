import DefaultLayout from "@/layouts/default";
import QuestionForm from "@/components/forms/QuestionForm";
import { useGetQuestion } from "@/hooks/questions";
import { useRouter } from "next/router";
import { useUpdateQuestions } from "@/hooks/questions";
import { Question } from "@/types/questions";

const EditQuestionsPage = () => {
  const router = useRouter();
  const { id } = router.query; // Extract questionId from the query parameters

  // Fetch the question using useGetQuestion hook
  const { data: question, isLoading, error } = useGetQuestion(id as string);

  // Mutation hook to update the question
  const { mutate: updateQuestion } = useUpdateQuestions();

  // Handle the form submission for updating the question
  const handleSubmit = (updatedData: Question) => {
    updateQuestion(
      { ...updatedData, questionId: id as string }, // Pass the updated question with ID
      {
        onSuccess: () => {
          router.push("/questions"); // Redirect to questions list on success
        },
        onError: (error) => {
          console.error("Error updating the question:", error);
        },
      }
    );
  };

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
        <QuestionForm
          formType="Edit"
          initialData={question}
          onSubmit={handleSubmit}
        />
      </div>
    </DefaultLayout>
  );
};

export default EditQuestionsPage;
