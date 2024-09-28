import React from "react";
import { Question, difficulties } from "../shared/Question";
import PeerprepButton from "../shared/PeerprepButton";

type QuestionCardProps = {
  question: Question;
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-500"; // Green for easy
      case "medium":
        return "text-yellow-500"; // Yellow for medium
      case "hard":
        return "text-red-500"; // Red for hard
      default:
        return "text-gray-100"; // Default color
    }
  };

  return (
    <div className="flex items-center w-full h-24 p-4 bg-gray-700 shadow-md rounded-lg mb-4">
      <div className="flex-none w-1/3 overflow-hidden">
        <h2 className="text-lg font-bold text-nowrap">{question.title}</h2>
        <p className="text-sm">
          Difficulty:{" "}
          <span
            className={`capitalize ${getDifficultyClass(
              difficulties[question.difficulty]
            )}`}
          >
            {difficulties[question.difficulty]}
          </span>
        </p>
        <p className="text-sm">
          Categories: <span>{question.categories.join(", ")}</span>
        </p>
      </div>

      <div className="flex-none w-1/2 max-h-16 overflow-hidden">
        <p className="text-sm text-wrap truncate text-right">
          {question.description}
        </p>
      </div>

      <div className="ml-10 mr-10">
        {/* display question page */}
        <PeerprepButton onClick={() => console.log("Expand button clicked!")}>
          View Question
        </PeerprepButton>
      </div>
    </div>
  );
};

export default QuestionCard;
