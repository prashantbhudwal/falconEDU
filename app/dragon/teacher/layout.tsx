export const metadata = {
  manifest: "/manifest-teacher.json",
};

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="min-h-screen w-full">{children}</main>;
}
