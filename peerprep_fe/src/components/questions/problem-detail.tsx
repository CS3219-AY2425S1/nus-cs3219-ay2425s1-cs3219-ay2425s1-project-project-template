import React from "react";
import { IQuestion } from "../../../../question_service/src/models/Question";

type ProblemDetailProps = {
  question: IQuestion;
};

const ProblemDetail: React.FC<ProblemDetailProps> = ({ question }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold">{question.title}</h1>
    </div>
  );
};

export default ProblemDetail;
