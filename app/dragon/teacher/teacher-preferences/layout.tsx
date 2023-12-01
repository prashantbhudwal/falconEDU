export default async function TeacherPreferencesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-y-auto custom-scrollbar bg-base-300">
      {children}
    </div>
  );
}
