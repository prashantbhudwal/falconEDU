export default function Block({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-800 text-white rounded-md px-4 py-2"
    />
  );
}
