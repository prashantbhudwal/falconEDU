export default async function TeacherPreferencesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="overflow-y-auto custom-scrollbar">{children}</div>;
}
