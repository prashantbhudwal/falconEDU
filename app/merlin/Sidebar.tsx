export default function Sidebar({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={className}>
      <div className="flex flex-col gap-4">
        <div className="bg-slate-900 text-slate-300 px-5 py-3 rounded-lg ring-1 ring-slate-500">
          <header className="text-xs font-medium text-slate-500 text-right flex justify-between items-baseline border-b border-solid border-slate-700 pb-2 ">
            <p className="uppercase">Sidebar</p>
            <p className="text-base">📚</p>
          </header>
          <p className="leading-6 text-base pt-2">Sidebar</p>
          {children}
        </div>
      </div>
    </div>
  );
}
