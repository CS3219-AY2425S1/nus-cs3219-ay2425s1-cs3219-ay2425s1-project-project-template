import React from "react";

export default function WaitTimeSelector({ waitTimes, selectedWaitTime, setSelectedWaitTime }) {
  return (
    <div className="mb-8">
      <div className="text-sm font-bold text-[#bcfe4d] mb-2">WAIT TIME</div>
      <div className="flex gap-2">
        {waitTimes.map((time) => (
          <button
            key={time}
            className={`px-4 py-2 rounded-full border-2 border-gray-700 text-white transition-colors ${
              selectedWaitTime === time ? "bg-[#bcfe4d] text-black" : "bg-gray-800 hover:bg-[#bcfe4d] hover:text-black"
            }`}
            onClick={() => setSelectedWaitTime(time)}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
}
