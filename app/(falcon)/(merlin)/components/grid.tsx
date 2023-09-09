export default function MerlinGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid h-full w-full select-none grid-cols-12 gap-2 overflow-y-auto">
      {children}
    </div>
  );
}
