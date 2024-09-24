import React from "react";
import Dashboard from "../components/dashboard.tsx";

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gradient-to-tr from-[#E0EFEF] via-[#8E9AA1] to-[#3D4553] w-screen h-screen flex flex-col">
      <Dashboard />
      <div className="flex flex-col items-center justify-center text-off-white flex-grow">
        <h1 className="text-8xl font-bold">
          Tech <br />
          Interview <br />
          Prep.
        </h1>
        <h2 className="text-4xl mt-4 text-black text-right">
          With a <br />
          friend.
        </h2>
        <p className="text-2xl text-black">
          Ace your tech interview by collaborating with a <br />
          peer matched specifically to you.
        </p>
        <button className="bg-black rounded-[25px] p-4 mt-4">
          Find your match!
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
