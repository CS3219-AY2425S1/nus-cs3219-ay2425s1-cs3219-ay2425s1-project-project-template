"use client";
import React from "react";
import { Question, Difficulty } from "@/api/structs";
import PeerprepButton from "../shared/PeerprepButton";
import { useRouter } from "next/navigation";

type QuestionCardProps = {
  question: Question;
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const router = useRouter();

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case Difficulty.Easy:
        return "text-green-500"; // Green for easy
      case Difficulty.Medium:
        return "text-yellow-500"; // Yellow for medium
      case Difficulty.Hard:
        return "text-red-500"; // Red for hard
      default:
        return "text-gray-100"; // Default color
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center w-full h-auto p-4 bg-gray-700 shadow-md rounded-lg mb-4">
      <div className="flex-none w-full sm:w-1/3 overflow-hidden">
        <h2 className="text-lg font-bold">{question.title}</h2>
        <p className="text-sm">
          Difficulty:{" "}
          <span
            className={`capitalize ${getDifficultyColor(question.difficulty)}`}
          >
            {Difficulty[question.difficulty]}
          </span>
        </p>
        <p className="text-sm">
          Categories:{" "}
          <span>
            {question.categories ? question.categories.join(", ") : "None"}
          </span>
        </p>
      </div>

      <div className="flex-none w-full sm:w-1/2 max-h-16 overflow-hidden">
        <p className="text-sm text-wrap truncate text-left">
          {question.description}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row ml-0 sm:ml-10 mr-0 sm:mr-10 w-full sm:w-1/6 items-center space-x-0 sm:space-x-2 space-y-2 sm:space-y-0">
        <PeerprepButton onClick={() => router.push(`questions/${question.id}`)}>
          View
        </PeerprepButton>
        <PeerprepButton
          onClick={() => console.log(`Deleting question ${question.id}`)}
        >
          Delete
        </PeerprepButton>
      </div>
    </div>
  );
};

export default QuestionCard;
