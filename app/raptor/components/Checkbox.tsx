"use client";
import React from "react";

type CheckboxProps = {
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string, checked: boolean) => void;
};

const Checkbox: React.FC<CheckboxProps> = ({
  value,
  label,
  checked,
  onChange,
}) => {
  const handleCheckboxChange = () => {
    onChange(value, !checked);
  };

  return (
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        name="questionType"
        value={value}
        checked={checked}
        onChange={handleCheckboxChange}
        className="appearance-none h-4 w-4 border border-gray-300 rounded-sm checked:bg-fuchsia-600 checked:border-transparent focus:outline-none"
      />
      <span className={checked ? "text-fuchsia-600" : ""}>{label}</span>
    </label>
  );
};

export default Checkbox;
