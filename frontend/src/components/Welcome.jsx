import React from "react";

const Welcome = ({ userName }) => {
  return (
    <div className="w-full max-w-md rounded-3xl bg-[#191919] p-6 text-white">
      <h2 className="mb-2 text-2xl font-bold">
        Welcome {userName ? userName : "Back"}!
      </h2>
      <p className="text-lg text-gray-400">
        We are excited to see you again. Let&apos;s get ready to continue your
        journey and achieve great things today.
      </p>
      <div className="mt-4">
        <button className="rounded-full bg-lime-300 px-4 py-2 text-gray-900 transition duration-300 hover:bg-lime-400">
          Start Practice
        </button>
      </div>
    </div>
  );
};

export default Welcome;
