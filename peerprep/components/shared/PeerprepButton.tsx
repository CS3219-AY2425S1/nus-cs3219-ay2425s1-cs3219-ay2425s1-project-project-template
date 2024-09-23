"use client";
import React from "react";

type PeerprepButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
};

const PeerprepButton: React.FC<PeerprepButtonProps> = ({
  onClick,
  children,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-400${className}`}
    >
      {children}
    </button>
  );
};

export default PeerprepButton;
