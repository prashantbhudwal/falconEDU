export default function AidCanvas({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${className} mt-0 h-full shadow-md bg-slate-200 py-4 flex flex-col items-center gap-4 text-slate-800 px-6 pb-96 marker:h-full scroll-smooth overflow-y-scroll custom-scrollbar`}
    >
      {children}
    </div>
  );
}
