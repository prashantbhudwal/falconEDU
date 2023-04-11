"use Client";
export default function Button({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "bg-emerald-500 ring-1 ring-slate-700 text-slate-700 rounded-md px-2 py-1 text-sm font-medium capitalize"
      }
    >
      {children}
    </button>
  );
}
