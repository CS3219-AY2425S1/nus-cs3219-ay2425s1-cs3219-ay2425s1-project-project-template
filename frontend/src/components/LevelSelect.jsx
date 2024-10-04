import React from "react";

export default function LevelSelector({ levels, selectedLevel, setSelectedLevel }) {
  return (
    <div className="mb-8">
      <div className="text-sm font-bold text-[#bcfe4d] mb-2">LEVEL</div>
      <div className="flex gap-2">
        {levels.map((level) => (
          <button
            key={level}
            className={`px-4 py-2 rounded-full border-2 border-gray-700 text-white transition-colors ${
              selectedLevel === level ? "bg-[#bcfe4d] text-black" : "bg-gray-800 hover:bg-[#bcfe4d] hover:text-black"
            }`}
            onClick={() => setSelectedLevel(level)}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
}
