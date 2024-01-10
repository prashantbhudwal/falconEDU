import React from "react";
import AdminNavbar from "../../_components/admin-navbar";
import { Title } from "@tremor/react";
import Timeline from "../../_components/timeline";
import { getTeacherTasksWithTeacherId } from "../../queries";

const TeacherPage = async ({ params }: { params: { teacherId: string } }) => {
  const teacher = await getTeacherTasksWithTeacherId({
    teacherId: params.teacherId,
  });

  return (
    <div>
      <AdminNavbar title="Teacher" />
      <Timeline teacher={teacher} />
    </div>
  );
};

export default TeacherPage;
