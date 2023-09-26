import Navbar from "@/components/navbar/navbar";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (session?.user.userType !== "TEACHER") return notFound();
  return (
    <div className="flex flex-col min-w-full h-screen">
      <Navbar />
      {children}
    </div>
  );
}
