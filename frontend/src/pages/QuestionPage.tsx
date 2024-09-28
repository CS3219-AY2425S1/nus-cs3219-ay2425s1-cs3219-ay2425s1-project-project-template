import React from "react";
import AdminNavBar from "../components/AdminNavBar.tsx";

const QuestionPage: React.FC = () => {
  return (
    <div className="w-screen h-screen flex flex-col">
      <AdminNavBar />
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
