import { cache } from "react";
import prisma from "@/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Link from "next/link";
export const revalidate = 3600; // revalidate the data at most every hour

const getClassesByTeacher = cache(async function (teacherId: string) {
  const classes = await prisma.class.findMany({
    where: {
      teacherId: teacherId,
    },
    select: {
      id: true,
      name: true,
      // Add more fields as needed
    },
  });
  return classes;
});

export default async function Classes() {
  const session = await getServerSession(authOptions);
  const teacherId = session?.user?.id;
  if (!teacherId) {
    return null;
  }

  const userType = await prisma.user.findUnique({
    where: {
      id: teacherId,
    },
    select: {
      userType: true,
    },
  });

  if (userType?.userType !== "TEACHER") {
    return null;
  }
  const classes = await getClassesByTeacher(teacherId);
  console.log(classes);

  return (
    <div>
      Classes
      <Link href={`/dragon/class/edit/${teacherId}`}>Test</Link>
    </div>
  );
}
