"use client";
import { CheckCircle2 } from "lucide-react";
import { useSearchStore } from "@/state/useSearchStore";
import { useMemo } from "react";

interface Problem {
  status: string;
  title: string;
  topics: string[];
  difficulty: string;
  difficultyColor: string;
}

interface ProblemTableProps {
  problems: Problem[];
}

export default function ProblemTable({ problems }: ProblemTableProps) {
  const { searchTerm } = useSearchStore();

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) =>
      problem.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [problems, searchTerm]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b border-gray-700">
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Title</th>
            <th className="py-2 px-4">Topics</th>
            <th className="py-2 px-4">Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {filteredProblems.map((problem, index) => (
            <ProblemRow key={index} problem={problem} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProblemRow({ problem }: { problem: Problem }) {
  return (
    <tr className="border-b border-gray-800 hover:bg-gray-800">
      <td className="py-2 px-4">
        <ProblemStatus status={problem.status} />
      </td>
      <td className="py-2 px-4 font-medium">{problem.title}</td>
      <td className="py-2 px-4">
        {problem.topics.map((topic, index) => (
          <span
            key={index}
            className="inline-block bg-gray-700 rounded-full px-2 py-1 text-xs font-semibold text-gray-300 mr-1 mb-1"
          >
            {topic}
          </span>
        ))}
      </td>
      <td className={`py-2 px-4 ${problem.difficultyColor}`}>
        {problem.difficulty}
      </td>
    </tr>
  );
}

function ProblemStatus({ status }: { status: string }) {
  if (status === "solved") {
    return <CheckCircle2 className="text-green-500 w-5 h-5" />;
  } else if (status === "attempted") {
    return <div className="w-5 h-5 rounded-full border-2 border-yellow-500" />;
  }
  return null;
}
