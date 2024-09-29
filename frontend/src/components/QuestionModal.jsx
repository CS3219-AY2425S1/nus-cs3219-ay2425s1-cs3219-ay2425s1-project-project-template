import { createQuestion, updateQuestion } from "../services/QuestionService";
import { useForm } from "react-hook-form";

const QuestionModal = (props) => {
  const { question, closeModal, setQuestions } = props;
  const modalTitle = question ? "Edit Question" : "Create Question";
  const defaultValues = question
    ? {
        title: question.title,
        description: question.description,
        category: question.category,
        complexity: question.complexity,
      }
    : {
        title: "", // Default values
        description: "",
        category: "",
        complexity: "",
      };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const sendPostQuestion = async (questionData) => {
    try {
      const response = await createQuestion(questionData);
      setQuestions((prevQuestions) => [...prevQuestions, response]);
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const sendUpdateQuestion = async (questionData) => {
    try {
      const response = await updateQuestion(question._id, questionData);
      const updatedQuestion = questionData;
      updatedQuestion._id = question._id;
      setQuestions((questions) =>
        questions.map((q) => {
          return q._id === question._id ? updatedQuestion : q;
        }),
      );
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = (questionData) => {
    if (question) {
      sendUpdateQuestion(questionData);
    } else {
      sendPostQuestion(questionData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-black shadow-lg">
        <h2 className="mb-4 text-xl font-bold">{modalTitle}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              {...register("title", { required: "Title is required" })}
              className="mt-1 w-full rounded border p-2"
              placeholder="Enter question title"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              {...register("description", {
                required: "Description is required",
              })}
              className="mt-1 w-full rounded border p-2"
              placeholder="Enter question description"
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              {...register("category", {
                required: "Category is required",
              })}
              className="mt-1 w-full rounded border p-2"
              placeholder="Enter question category"
            />
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          {/* Complexity Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Complexity
            </label>
            <input
              {...register("complexity", {
                required: "Complexity is required",
                validate: (value) => {
                  return (
                    ["Easy", "Medium", "Hard"].includes(value) ||
                    "Complexity must be Easy, Medium, or Hard"
                  );
                },
              })}
              className="mt-1 w-full rounded border p-2"
              placeholder="Enter question complexity"
            />
            {errors.complexity && (
              <p className="text-sm text-red-500">
                {errors.complexity.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={closeModal}
        >
          Close Modal
        </button>
      </div>
    </div>
  );
};

export default QuestionModal;
