import React from "react";

interface DropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function Dropdown({ options, value, onChange, placeholder }: DropdownProps) {
  return (
    <select
      className="py-2 px-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-blue-100"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

