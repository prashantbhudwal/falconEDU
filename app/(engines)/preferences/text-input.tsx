"use client";
import { ChangeEvent, InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  ...restProps
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="w-96 rounded-md border-slate-700 bg-slate-300 px-6 py-4 text-xl text-text-900"
      {...restProps}
    />
  );
};

export default TextInput;
