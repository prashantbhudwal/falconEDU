export default function Sidebar({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={`${className} flex flex-col gap-6 text-slate-300 px-5 py-3 rounded-lg ring-1 ring-slate-500`}
    >
      {children}
    </div>
  );
}
