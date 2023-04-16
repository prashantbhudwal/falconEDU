export default function Sidebar({
  children,
  className,
  heading,
}: React.PropsWithChildren<{ className?: string; heading: string }>) {
  return (
    <div
      className={`${className} flex flex-col gap-4 bg-slate-900 text-slate-300 px-5 py-3 rounded-lg ring-1 ring-slate-500`}
    >
      <header className="text-center font-medium text-slate-500 border-b border-solid border-slate-700 pb-2 ">
        <p className="capitalize">{heading}</p>
      </header>
      {children}
    </div>
  );
}
