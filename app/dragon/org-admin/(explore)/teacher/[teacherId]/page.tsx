import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import { db } from "@/lib/routers";
import { url } from "@/lib/urls";
import { SetBackBar } from "../../../../../../components/back-bar/set-back-bar";
import Link from "next/link";
import { ClassCard } from "@/components/dragon/class-card";
import { Separator } from "@/components/ui/separator";

const TeacherPage = async ({
  params,
}: {
  params: { teacherId: string; taskId: string };
}) => {
  const teacherId = params.teacherId;
  const session = await getServerSession(authOptions);
  const org = await db.admin.org.getOrgByUserId(session?.user?.id || "");
  if (org && org.teacher.length === 0) {
    redirect("/dragon/org-admin");
  }
  const classes = await db.teacher.getClassesByTeacherId({ teacherId });
  const name =
    (await db.teacher.getTeacherNameByTeacherId({ teacherId })) || "";

  return (
    <div className="flex flex-col items-center space-y-4">
      <SetBackBar
        title={name || "Teacher Profile"}
        url={url.orgAdmin.explore.home}
      />
      <h1 className="font-bold">All Classes</h1>
      <Separator />
      <div className="px-auto grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
        {classes.map((classItem) => {
          return (
            <Link
              key={classItem.id}
              href={url.orgAdmin.explore.class({
                teacherId,
                classId: classItem.id,
              })}
            >
              <ClassCard
                grade={classItem.grade}
                section={classItem.section}
                className="rounded-lg"
                id={classItem.id}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherPage;
