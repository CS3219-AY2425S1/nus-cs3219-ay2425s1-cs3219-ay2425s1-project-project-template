import React from "react";

export default function Problems({ problem }) {
  if (!problem) {
    console.log("Question not found");
    return <p>Loading problem...</p>;
  }

  return (
    <div className="mb-8">
      <div className="text-L font-bold text-[#bcfe4d] mb-2">PROBLEM</div>
      <div className="bg-[#1e1e1e] rounded p-4">
        <h2 className="text-xl font-bold mb-4 text-white">{problem.title}</h2>
        <div className="flex gap-2 mb-4">
          <span
            className={`px-4 py-1 rounded-full text-sm text-black ${
              problem.complexity === "Easy"
                ? "bg-green-400"
                : problem.complexity === "Medium"
                ? "bg-yellow-400"
                : "bg-red-400"
            }`}
          >
            {problem.complexity}
          </span>
        </div>
        <div className="text-white mb-6" style={{ whiteSpace: 'pre-line' }}>{problem.description}</div>
      </div>
    </div>
  );
}
