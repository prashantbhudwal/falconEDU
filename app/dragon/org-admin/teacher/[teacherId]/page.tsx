import React from "react";
import { AdminNavbar } from "../../_components/navbar";
import { Timeline } from "./timeline";
import { getOrgByUserId, getTeacherTasksWithTeacherId } from "../../queries";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { formatName } from "@/lib/utils";
import { redirect } from "next/navigation";

const TeacherPage = async ({ params }: { params: { teacherId: string } }) => {
  const session = await getServerSession(authOptions);
  const org = await getOrgByUserId(session?.user?.id || "");
  const teacher = await getTeacherTasksWithTeacherId({
    teacherId: params.teacherId,
  });
  if (org && org.teacher.length === 0) {
    redirect("/dragon/org-admin");
  }
  return (
    <div className="flex h-screen min-w-full flex-col">
      <AdminNavbar
        title={formatName({ name: teacher?.name || "" }) || "Teacher"}
      />
      <div className="custom-scrollbar overflow-y-auto">
        <Timeline teacher={teacher} />
      </div>
    </div>
  );
};

export default TeacherPage;
