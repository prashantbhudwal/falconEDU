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
      onClick={onClick}
      className={
        "bg-emerald-500 ring-1 ring-slate-700 text-slate-700 rounded-md px-4 py-2 text-sm font-medium"
      }
    >
      {children}
    </button>
  );
}
