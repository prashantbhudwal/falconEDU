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
      className="border-slate-700 rounded-md bg-slate-300 text-slate-900 px-6 py-4 w-96 text-xl"
      {...restProps}
    />
  );
};

export default TextInput;
