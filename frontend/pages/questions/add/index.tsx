import { useState } from "react";

import DefaultLayout from "@/layouts/default";
import QuestionForm from "@/components/forms/QuestionForm";
import { Question } from "@/types/questions";

const AddQuestionsPage = () => {
  const [formData, setFormData] = useState<Question>({
    title: "",
    complexity: "",
    category: [],
    description: "",
  });

  const handleOnSubmit = (updatedData: Question) => {
    console.log(updatedData);
  };

  return (
    <DefaultLayout>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-4xl p-4 border-solid border-2 rounded-lg">
          <QuestionForm
            formData={formData}
            formType="Add"
            setFormData={setFormData}
            onSubmit={handleOnSubmit}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddQuestionsPage;
