import { getServerSession } from "next-auth";
import { authOptions } from "@/app/(schools)/api/auth/[...nextauth]/authOptions";
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
    <div className="flex h-screen w-full flex-col bg-base-300">
      <StudentHomeNavbar />
      <main className="custom-scrollbar flex flex-1 flex-col overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
