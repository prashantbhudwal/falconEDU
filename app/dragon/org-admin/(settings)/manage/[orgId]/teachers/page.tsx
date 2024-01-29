import React from "react";
import { AddTeacherForm } from "./add-teacher-form";
import { getTeachersWithUserId } from "../../../../queries";
import { Card, Flex, Text, Title } from "@tremor/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { TeacherCard } from "./teacher-card";

export default async function AddTeacherPage({
  params: { orgId },
}: {
  params: { orgId: string };
}) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return null;
  const teachers = await getTeachersWithUserId({ userId });
  return (
    <>
      <div className="mx-auto my-10 w-11/12">
        <AddTeacherForm orgId={orgId} />
        {teachers?.map((teacher) => (
          <TeacherCard teacher={teacher} key={teacher.id} />
        ))}
      </div>
    </>
  );
}
