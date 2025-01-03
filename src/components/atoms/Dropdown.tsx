import React from "react";

type DropdownVariant = "primary" | "inverted";

interface DropdownProps {
  variant?: DropdownVariant;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export default function Dropdown({
  variant = "primary",
  options,
  value,
  onChange,
}: DropdownProps) {
  const baseStyles = "py-2 px-4 rounded-md transition w-full ";

  const variantStyles: Record<DropdownVariant, string> = {
    primary:
      "bg-primary border border-primary text-white hover:bg-white hover:text-primary",
    inverted:
      "bg-primary-fill text-primary border border-white hover:bg-primary hover:text-white",
  };

  return (
    <select
      className={`${baseStyles} ${variantStyles[variant]}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
