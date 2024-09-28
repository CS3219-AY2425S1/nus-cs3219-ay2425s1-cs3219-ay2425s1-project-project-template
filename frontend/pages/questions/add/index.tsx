import DefaultLayout from "@/layouts/default";
import QuestionForm from "@/components/forms/QuestionForm";

const AddQuestionsPage = () => {
  return (
    <DefaultLayout>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-4xl p-4 border-solid border-2 rounded-lg">
          <QuestionForm formType="Add" />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddQuestionsPage;
