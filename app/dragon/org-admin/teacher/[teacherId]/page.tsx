import React from "react";
import AdminNavbar from "../../_components/admin-navbar";
import { Title } from "@tremor/react";
import Timeline from "../../_components/timeline";
import { getOrgByUserId, getTeacherTasksWithTeacherId } from "../../queries";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import RedirectComponent from "../../_components/redirect";
import { formatName } from "@/lib/utils";

const TeacherPage = async ({ params }: { params: { teacherId: string } }) => {
  const session = await getServerSession(authOptions); // get this from layout instead of calling again
  const org = await getOrgByUserId(session?.user?.id || "");
  const teacher = await getTeacherTasksWithTeacherId({
    teacherId: params.teacherId,
  });

  if (org && org.teacher.length === 0) {
    return <RedirectComponent redirectUrl="/dragon/org-admin" />;
  }
  return (
    <div>
      <AdminNavbar
        title={formatName({ name: teacher?.name || "" }) || "Teacher"}
      />
      <Timeline teacher={teacher} />
    </div>
  );
};

export default TeacherPage;
