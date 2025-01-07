import React from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  indeterminate?: boolean;
  hoverColor?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, indeterminate, hoverColor }) => {
  return (
    <input
      type="checkbox"
      onChange={onChange}
      checked={checked}
      ref={(input) => {
        if (input) input.indeterminate = indeterminate || false;
      }}
      className={`form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out 
                  ${hoverColor ? `hover:border-${hoverColor}-400` : ''} 
                  focus:ring-blue-500`}
    />
  );
};

export default Checkbox;
