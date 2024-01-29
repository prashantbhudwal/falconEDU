import React from "react";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { AddTeacherForm } from "@/app/dragon/org-admin/_components/add-user-form";
import { UserManagementCard } from "@/app/dragon/org-admin/_components/user-card";
import { db } from "@/lib/routers";

export default async function AddTeacherPage({
  params: { orgId },
}: {
  params: { orgId: string };
}) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return null;
  const teachers = await db.org.getTeachersInOrg({ userId });
  return (
    <>
      <div className="mx-auto my-2 flex w-11/12 flex-col space-y-6">
        <div className="self-center font-bold text-accent">Manage Teachers</div>

        <AddTeacherForm orgId={orgId} />
        {teachers?.map((teacher) => (
          <UserManagementCard
            key={teacher.id}
            name={teacher.User.name ?? ""}
            email={teacher.User.email ?? ""}
            image={teacher.User.image}
            userId={teacher.userId}
            removeUserFunction={db.org.removeTeacherFromOrg}
          />
        ))}
      </div>
    </>
  );
}
