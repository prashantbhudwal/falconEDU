export default function Sidebar({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={`${className} custom-scrollbar flex flex-col gap-6 overflow-y-auto px-4 py-3 text-slate-300  ring-slate-500`}
    >
      {children}
    </div>
  );
}
