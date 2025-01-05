import React from "react";

interface DropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export default function Dropdown({ options, value, onChange }: DropdownProps) {
  return (
    <select
      className="py-2 px-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-blue-100"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option
          key={option}
          value={option}
          style={{
            backgroundColor: option === value ? "blue" : "",
            color: option === value ? "white" : "",
          }}
        >
          {option}
        </option>
      ))}
    </select>
  );
}