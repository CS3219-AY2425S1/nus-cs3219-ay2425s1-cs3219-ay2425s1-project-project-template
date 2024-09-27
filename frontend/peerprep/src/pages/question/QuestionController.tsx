import React, { useEffect, useState } from "react";
import QuestionView from "./QuestionView";
import { Question } from "./questionService";
import { useApiContext } from "../../context/ApiContext";

const QuestionController: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);

  const api = useApiContext();

  useEffect(() => {
    api
      .get("/questions")
      .then((response) => {
        // use the api instance to make post request using axios post method
        if (response.status === 200) {
          setQuestions(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return <QuestionView questions={questions} />;
};

export default QuestionController;
