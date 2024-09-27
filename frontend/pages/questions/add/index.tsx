import { useState } from "react";

import DefaultLayout from "@/layouts/default";
import QuestionForm from "@/components/forms/QuestionForm";
import { Question } from "@/types";

const AddQuestionsPage = () => {
  const [formData, setFormData] = useState<Question>({
    title: "",
    complexity: "",
    category: [],
    description: "",
  });

  const handleSubmit = (formData: Question) => {
    console.log(formData);
  };

  return (
    <DefaultLayout>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-4xl p-4 border-solid border-2 rounded-lg">
          <QuestionForm
            formData={formData}
            formType="Add"
            handleSubmit={handleSubmit}
            setFormData={setFormData}
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AddQuestionsPage;
