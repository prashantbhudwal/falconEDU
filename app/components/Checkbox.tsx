"use client";
import React from "react";
import { QuestionType } from "@/types";

type CheckboxProps = {
  value: QuestionType;
  label: string;
  checked: boolean;
  onChange: (value: QuestionType, checked: boolean) => void;
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
    <label className="label text-sm">
      <span className={"label-text"}>{label}</span>
      <input
        type="checkbox"
        name="questionType"
        value={value}
        checked={checked}
        onChange={handleCheckboxChange}
        className="checkbox checkbox-info checkbox-sm"
      />
    </label>
  );
};

export default Checkbox;
