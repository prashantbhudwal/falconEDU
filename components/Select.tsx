import { ChangeEvent } from "react";

interface SelectProps {
  options: { id: string | number; name: string }[];
  value: string | number;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  label: string;
}

export default function Select(props: SelectProps) {
  const { options, value, onChange, label } = props;

  return (
    <select
      onChange={onChange}
      value={value}
      className="border-slate-700 rounded-md bg-slate-300 text-black p-4 w-96"
    >
      <option value="">{`Select ${label}`}</option>
      {options.map((option) => (
        <option key={option.id} value={option.name}>
          {option.name}
        </option>
      ))}
    </select>
  );
}
