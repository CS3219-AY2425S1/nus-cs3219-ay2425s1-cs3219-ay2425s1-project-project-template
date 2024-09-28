"use client";
import React from "react";

type PeerprepDropdownProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  className?: string;
};

const PeerprepDropdown: React.FC<PeerprepDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  className,
}) => {
  return (
    <div className="flex flex-col space-y-1 space-x-2">
      <label className="text-base font-medium">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className={`text-black border rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-300 ${className}`}
      >
        {options.map((option) => (
          <option className="capitalize" key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PeerprepDropdown;
