export default function ButtonPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex gap-4 justify-between m-4">{children}</div>;
}
