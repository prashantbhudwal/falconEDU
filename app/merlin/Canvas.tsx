export default function Canvas({
  children,
  className,
}: {
  children: any;
  className?: string;
}) {
  return (
    <div
      className={`${className} flex flex-col items-center gap-4 bg-slate-900  text-slate-300 px-5 py-3 rounded-lg ring-2 ring-emerald-500 shadow-emerald-500 shadow-md`}
    >
      <header className="font-medium text-emerald-500 text-center border-b border-solid border-emerald-700 pb-2">
        <p className="uppercase">Canvas</p>
      </header>
      {children}
    </div>
  );
}
