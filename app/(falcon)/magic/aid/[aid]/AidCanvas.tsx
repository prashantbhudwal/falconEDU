export default function AidCanvas({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${className} flex flex-col items-center gap-4 text-slate-300 px-5 py-3 rounded-md ring-1 ring-emerald-500 shadow-emerald-500 ${"shadow-md bg-slate-900"}`}
    >
      {children}
    </div>
  );
}
