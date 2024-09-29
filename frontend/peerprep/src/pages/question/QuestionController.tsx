import React, { useEffect, useState } from "react";
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
    // useEffect(() => {
    //   api
    //     .get("/questions")
    //     .then((response) => {
    //       // use the api instance to make post request using axios post method
    //       if (response.status === 200) {
    //         setQuestions(response.data);
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // }, [api]);

    // const handleDeleteQuestion = (title: string) => {
    //   console.log("Attempting to delete question with title:", title); // Debugging statement

    //   if (title === undefined) {
    //     console.error("No valid TITLE provided for deletion.");
    //     return; // Early exit if TITLE is undefined
    //   }

    //   // Proceed with deleting from state
    //   setQuestions((prevQuestions) => prevQuestions.filter((q) => q.Title !== title));

    //   // Call the API to delete the question on the backend
    //   api
    //     .delete(`/questions/${title}`)
    //     .then((response) => {
    //       console.log(`Question with title ${title} deleted successfully.`);
    //     })
    //     .catch((error) => {
    //       console.error(`Error deleting question with title ${title}:`, error);
    //     });
    // };
  );
};

export default QuestionController;
