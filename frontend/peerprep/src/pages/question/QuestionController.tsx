import React from "react";
import QuestionView from "./QuestionView";
import { Question } from "./questionService";
import { useApiContext } from "../../context/ApiContext";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";

const QuestionController: React.FC = () => {
  // const [questions, setQuestions] = useState<Question[]>([]);

  const api = useApiContext();

  const fetchQuestions = async (): Promise<Question[]> => {
    try {
      const response = await api.get<Question[]>("/questions"); // Adjust the endpoint as necessary
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error: ", error.response?.data || error.message);
        throw new Error(
          error.response?.data?.message ||
            "An error occurred while fetching user data"
        );
      } else {
        console.error("Unknown error: ", error);
        throw new Error("An unexpected error occurred");
      }
    }
  };

  const {
    data: questions,
    status: questionsStatus,
    refetch: refetchQuestions,
  } = useQuery({
    queryKey: ["questions"],
    queryFn: fetchQuestions,
    placeholderData: keepPreviousData,
  });

  if (questions === undefined) {
    return <div>No Questions Available</div>;
  }

  return (
    <QuestionView questions={questions} refetchQuestions={refetchQuestions} />
  );
};

export default QuestionController;
