import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/(schools)/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import { db } from "@/lib/routers";
import { url } from "@/lib/urls";
import { SetBackBar } from "@/components/back-bar/set-back-bar";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { formatDateWithTimeZone, formatName } from "@/lib/utils";
import { getTaskProperties } from "@/lib/helpers";
import { TaskType } from "@/types";
import { Separator } from "@/components/ui/separator";
const TeacherPage = async ({
  params,
}: {
  params: { teacherId: string; classId: string; taskId: string };
}) => {
  const { teacherId, classId } = params;
  const session = await getServerSession(authOptions);
  const org = await db.admin.org.getOrgByUserId(session?.user?.id || "");
  const teacherWithTasks = await db.admin.teacher.getTeacherTasksWithTeacherId({
    teacherId: params.teacherId,
  });
  if (org && org.teacher.length === 0) {
    redirect("/dragon/org-admin");
  }
  const tasks = teacherWithTasks?.tasks?.filter(
    (task) => task.classId === classId,
  );

  const nameOfClass = await db.class.getFormattedClassNameByClassId({
    classId,
  });

  if (!tasks || tasks.length === 0)
    return (
      <>
        <SetBackBar
          title={nameOfClass || "Teacher Profile"}
          url={url.orgAdmin.explore.teacher(teacherId)}
        />
        <div className="w-full items-center justify-center">
          <div className="mb-2 mt-5 text-center">No Tasks Yet</div>
        </div>
      </>
    );

  return (
    <div className="flex flex-col space-y-3">
      <SetBackBar
        title={nameOfClass || "Teacher Profile"}
        url={url.orgAdmin.explore.teacher(teacherId)}
      />
      {tasks.map((task) => {
        const link = url.orgAdmin.explore.task({
          teacherId,
          taskId: task.id,
          classId,
        });
        const taskType = getTaskProperties(task.type as TaskType).formattedType;
        const taskDate = formatDateWithTimeZone({
          createdAt: task.createdAt,
          dateFormat: "dd MMM",
        });
        return (
          <Link href={link} key={task.id}>
            <Card>
              <CardHeader className="flex h-full flex-row items-center space-x-8">
                <div className="text-sm font-medium">{taskDate}</div>
                <div className="flex flex-col gap-2">
                  <CardTitle>{formatName({ name: task.name })}</CardTitle>
                  <CardDescription>{taskType}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default TeacherPage;
