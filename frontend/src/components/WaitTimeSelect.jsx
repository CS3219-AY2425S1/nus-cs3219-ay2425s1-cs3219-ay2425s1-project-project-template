import React from "react";

export default function WaitTimeSelector({ waitTimes, selectedWaitTime, setSelectedWaitTime }) {
  return (
    <div>
      <div className="text-L font-bold text-[#bcfe4d] mb-4">WAIT TIME</div>
      <div className="flex gap-2">
        {waitTimes.map((time) => (
          <button
            key={time}
            className={`px-4 py-1 rounded-full bg-[#DDDDDD] text-sm text-black transition-colors ${
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
