import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { cache } from "react";
import prisma from "@/prisma";
import { NewClassCard } from "./components/new-class-card";
import ClassCard from "./components/class-card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { getBotsURL } from "@/lib/urls";

export const revalidate = 3600; // revalidate the data at most every hour

const getClassesByUserId = cache(async function (userId: string) {
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId },
  });

  if (!teacherProfile) {
    throw new Error(`TeacherProfile with userId ${userId} not found`);
  }

  const classes = await prisma.class.findMany({
    where: {
      teacherId: teacherProfile.id,
    },
  });

  return classes;
});

export default async function Classes() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return null;
  }
  const classes = await getClassesByUserId(userId);
  return (
    <div className="flex flex-col gap-3 p-10">
      <div className="w-60 mb-8">
        <NewClassCard />
      </div>
      <Separator />
      <h1 className="text-3xl font-bold mt-8">Classes</h1>
      <div className="flex flex-row gap-5 h-36 items-center">
        {classes.map((classData) => (
          <Link href={getBotsURL(classData.id)} key={classData.id}>
            <ClassCard>{classData.name}</ClassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
