import React from "react";

export default function Problems({ problem }) {
  return (
    <div className="mb-8">
      <div className="text-L font-bold text-[#bcfe4d] mb-4">PROBLEM</div>
      <div className="bg-[#1e1e1e] rounded p-4">
        <h2 className="text-xl font-bold mb-4 text-white">{problem.title}</h2>
        <div className="flex gap-2 mb-4">
          <span
            className={`px-4 py-1 rounded-full text-sm text-black ${
              problem.difficulty === "Easy"
                ? "bg-green-400"
                : problem.difficulty === "Medium"
                ? "bg-yellow-400"
                : "bg-red-400"
            }`}
          >
            {problem.difficulty}
          </span>
          {problem.tags.map((tag, index) => (
            <span
              key={index}
              className="px-4 py-1 rounded-full text-sm text-black bg-[#DDDDDD]"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="text-white mb-6">{problem.description}</div>
        <div className="space-y-4">
          {problem.examples.map((example, index) => (
            <div key={index} className="bg-[#333333] p-4 rounded">
              <div className="text-[#bcfe4d] font-bold mb-2">Example {index + 1}:</div>
              <div className="text-white">
                <div><span className="text-[#bcfe4d]">Input:</span> {example.input}</div>
                <div><span className="text-[#bcfe4d]">Output:</span> {example.output}</div>
                {example.explanation && (
                  <div><span className="text-[#bcfe4d]">Explanation:</span> {example.explanation}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}