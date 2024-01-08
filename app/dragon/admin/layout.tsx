export const metadata = {
  manifest: "/manifest-teacher.json",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen h-screen w-full overflow-y-scroll custom-scrollbar">
      {children}
    </main>
  );
}
