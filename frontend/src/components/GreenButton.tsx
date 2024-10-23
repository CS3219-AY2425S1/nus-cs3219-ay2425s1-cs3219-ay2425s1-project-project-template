import React from "react";

interface GreenButtonProps {
  onClick: () => void; // Function to handle click event
  label: string; // Text label for the button
  className?: string; // Optional additional classes for styling
}

const GreenButton: React.FC<GreenButtonProps> = ({
  onClick,
  label,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={`bg-green rounded-[25px] p-4 text-2xl hover:bg-emerald-700 ${className}`}
    >
      {label}
    </button>
  );
};

export default GreenButton;
