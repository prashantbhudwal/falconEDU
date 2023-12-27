import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { notFound } from "next/navigation";
import { StudentHomeNavbar } from "../student/components/student-navbar";

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (session?.user.userType !== "PARENT") notFound();
  return (
    <div className="flex flex-col h-screen w-full bg-base-300">
      <StudentHomeNavbar />
      <main className="flex flex-col flex-1 overflow-y-auto custom-scrollbar">
        {children}
      </main>
    </div>
  );
}
