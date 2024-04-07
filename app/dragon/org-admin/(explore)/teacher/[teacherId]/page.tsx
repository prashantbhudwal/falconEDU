import React from "react";
import { AdminNavbar } from "../../../components/navbar";
import { Timeline } from "./timeline";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { formatName } from "@/lib/utils";
import { redirect } from "next/navigation";
import { db } from "@/lib/routers";

const TeacherPage = async ({ params }: { params: { teacherId: string } }) => {
  const session = await getServerSession(authOptions);
  const org = await db.admin.org.getOrgByUserId(session?.user?.id || "");
  const teacher = await db.admin.teacher.getTeacherTasksWithTeacherId({
    teacherId: params.teacherId,
  });
  if (org && org.teacher.length === 0) {
    redirect("/dragon/org-admin");
  }
  return (
    <div className="flex h-screen min-w-full flex-col">
      <div className="custom-scrollbar overflow-y-auto">
        <Timeline teacher={teacher} />
      </div>
    </div>
  );
};

export default TeacherPage;
