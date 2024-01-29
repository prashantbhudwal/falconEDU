import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { AddStudentForm } from "@/app/dragon/org-admin/_components/add-user-form";
import { UserManagementCard } from "@/app/dragon/org-admin/_components/user-card";
import { db } from "@/lib/routers";
import { getServerSession } from "next-auth";

export default async function ManageStudents({
  params: { orgId },
}: {
  params: { orgId: string };
}) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return null;
  const students = await db.org.getStudentsInOrg({ userId });
  return (
    <>
      <div className="mx-auto my-2 w-11/12">
        <div className="self-center font-bold text-accent">
          {" "}
          Manage Students
        </div>
        <AddStudentForm orgId={orgId} />
        {students?.map((student) => (
          <UserManagementCard
            key={student.id}
            name={student.User.name ?? ""}
            email={student.User.email ?? ""}
            image={student.User.image}
            userId={student.userId}
            removeUserFunction={db.org.removeStudentFromOrg}
          />
        ))}
      </div>
    </>
  );
}
