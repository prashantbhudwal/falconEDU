import { authOptions } from "@/app/(schools)/api/auth/[...nextauth]/authOptions";
import { AddStudentForm } from "@/app/(schools)/dragon/org-admin/components/add-user-form";
import { UserManagementCard } from "@/app/(schools)/dragon/org-admin/components/user-card";
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
      <div className="mx-auto my-2 flex w-11/12 flex-col space-y-6">
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
