import React from "react";
import NavBar from "../components/NavBar.tsx";

const QuestionPage: React.FC = () => {

  return (
    <div className="w-screen h-screen flex flex-col">
      <NavBar />
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          QuestionDisplay
        </div>
        <div className="flex flex-col">editor</div>
      </div>
    </div>
  );
};

export default QuestionPage;
