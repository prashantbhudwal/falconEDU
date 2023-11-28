import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import ConditionalNav from "./components/conditional-navbar";
import { db } from "./routers";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) return;
  if (session?.user.userType !== "TEACHER") notFound();
  const userId = session.user.id;
  const orgMode = await db.teacher.teacherHasOrgMode({ userId });
  if (!orgMode) redirect("/dragon/auth/request-access");

  return (
    <div className="flex flex-col min-w-full h-screen">
      <ConditionalNav />
      {children}
    </div>
  );
}
