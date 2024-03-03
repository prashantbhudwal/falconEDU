import { Sidebar } from "./components/sidebar/sidebar";

export const metadata = {
  manifest: "/manifest-teacher.json",
};

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="grid h-screen min-h-screen w-full grid-cols-12">
      <div className="col-start-1 col-end-3">
        <Sidebar />
      </div>
      <div className="col-start-3 col-end-13 overflow-y-auto">{children}</div>
    </main>
  );
}
