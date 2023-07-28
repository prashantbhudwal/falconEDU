export default function Sidebar({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={`${className} overflow-y-auto custom-scrollbar flex flex-col gap-6 text-slate-300 px-4 py-3  ring-slate-500`}
    >
      {children}
    </div>
  );
}
