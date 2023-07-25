export default function MerlinGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full grid grid-cols-12 gap-4 w-full select-none overflow-y-auto">
      {children}
    </div>
  );
}
