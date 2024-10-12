import React from "react";
import Navbar from "../components/Navbar";

const About = () => {
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center">
        <div className="relative m-4 h-[calc(100vh-6rem)] w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border border-gray-300/20 px-8"></div>
      </div>
    </>
  );
};

export default About;
