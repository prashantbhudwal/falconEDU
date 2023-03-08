"use Client";
export default function Button({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={() => onClick()}
      className={"bg-green-600 text-white rounded-md px-4 py-2"}
    >
      {children}
    </button>
  );
}
