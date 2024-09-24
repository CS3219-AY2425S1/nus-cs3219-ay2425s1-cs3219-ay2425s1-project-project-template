import React from "react";
import Dashboard from "../components/dashboard.tsx";

const QuestionPage: React.FC = () => {
  return (
    <div>
      <Dashboard />
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">Question</div>
        <div className="flex flex-col">editor</div>
      </div>
    </div>
  );
};

export default QuestionPage;
