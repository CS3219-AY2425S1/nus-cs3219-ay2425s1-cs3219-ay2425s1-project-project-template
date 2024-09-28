// PeerprepSearchBar.tsx
import React from "react";

interface PeerprepSearchBarProps {
  value: string;
  label?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PeerprepSearchBar: React.FC<PeerprepSearchBarProps> = ({
  value,
  label = "Search...",
  onChange,
}) => {
  return (
    <div className="flex flex-col">
      <input
        type="text"
        placeholder={label}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-md p-2 w-full text-black"
      />
    </div>
  );
};

export default PeerprepSearchBar;
