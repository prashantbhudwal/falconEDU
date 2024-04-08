import React from "react";
import { AdminNavbar } from "../../../components/navbar";
import { Timeline } from "./timeline";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { formatName } from "@/lib/utils";
import { redirect } from "next/navigation";
import { db } from "@/lib/routers";
import { url } from "@/lib/urls";
import { SetBackBar } from "../../../../../../components/back-bar/set-back-bar";

const TeacherPage = async ({
  params,
}: {
  params: { teacherId: string; taskId: string };
}) => {
  const teacherId = params.teacherId;
  const session = await getServerSession(authOptions);
  const org = await db.admin.org.getOrgByUserId(session?.user?.id || "");
  const teacher = await db.admin.teacher.getTeacherTasksWithTeacherId({
    teacherId: params.teacherId,
  });
  if (org && org.teacher.length === 0) {
    redirect("/dragon/org-admin");
  }
  return (
    <>
      <SetBackBar
        title={teacher?.name || "Teacher Profile"}
        url={url.orgAdmin.explore.home}
      />
      <Timeline teacher={teacher} teacherId={teacherId} />
    </>
  );
};

export default TeacherPage;
