"use client";
import { ChangeEvent } from "react";

interface TextInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="border-slate-700 rounded-md bg-slate-300 text-black p-4 w-96"
      placeholder={placeholder}
    />
  );
};

export default TextInput;
