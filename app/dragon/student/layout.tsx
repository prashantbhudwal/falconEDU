import Navbar from "@/components/navbar/navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { notFound } from "next/navigation";
import { StudentBotNavbar } from "./components/student-navbar";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (session?.user.userType !== "STUDENT") notFound();
  return (
    <div className="flex flex-col min-h-screen w-full bg-base-300">
      <StudentBotNavbar />
      <main className="flex flex-col flex-1">{children}</main>
    </div>
  );
}
