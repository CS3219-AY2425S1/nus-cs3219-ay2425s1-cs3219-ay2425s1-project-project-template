import { getQuestion } from "@/app/actions/questions";
import { QuestionDto } from "@/app/types/QuestionDto";
import { useAuth } from "@/contexts/auth-context";
import React, { useEffect, useState } from "react";

type ProblemProps = {};

const Problem: React.FC<ProblemProps> = () => {
  const [question, setQuestion] = useState<QuestionDto>();
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      console.log(token);
      // // TODO: Validate token is still valid

      getQuestion("66f80ee149fb3b6d5782fea1", token).then((data) => {
        setQuestion(data?.message);
      });
    }
  }, [token]);

  console.log(`use this question to populate problem details ${question}`);

  return (
    <div className="flex flex-col h-screen p-4">
      {/* Title bar for the problem */}
      <div className="workspacecomponent">
        <h2 className="text-xl font-semibold text-gray-800">Problem</h2>
      </div>
      {/* Problem content */}
      <div className="flex-grow p-6 bg-white rounded-b-lg shadow-sm">
        <p className="text-gray-700">Problem details will go here...</p>
      </div>
    </div>
  );
};

export default Problem;
