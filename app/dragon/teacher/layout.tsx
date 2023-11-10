import Navbar from "@/components/navbar/navbar";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import prisma from "@/prisma";

async function getTeacherOrgMode(userId: string) {
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: {
      userId: userId,
    },
    select: {
      orgMode: true,
    },
  });
  if (!teacherProfile) return notFound();

  return teacherProfile.orgMode;
}

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) return notFound();
  if (session?.user.userType !== "TEACHER") return notFound();
  const orgMode = await getTeacherOrgMode(session.user.id);
  if (!orgMode) return redirect("/dragon/auth/request-access");

  return (
    <div className="flex flex-col min-w-full h-screen">
      <Navbar />
      {children}
    </div>
  );
}
