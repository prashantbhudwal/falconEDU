import { Paper } from "@/components/ui/Paper";
import ClassForm from "../../add-students-form";
import { StudentTable } from "../../students-table";
import prisma from "@/prisma";
import { cache } from "react";
import { Separator } from "@/components/ui/separator";

export const revalidate = 3600; // revalidate the data at most every hour
type EditClassProps = {
  params: {
    teacherId: string;
  };
};

const getStudents = cache(async function (teacherId: string) {
  const classes = await prisma.class.findMany({
    where: {
      teacherId: teacherId,
    },
    include: {
      students: {
        select: {
          grade: true,
          User: {
            select: {
              name: true,
              email: true,
              id: true,
            },
          },
        },
      },
    },
  });
  const flatStudents = classes.map((cls) => cls.students).flat();

  const result = flatStudents.map((student) => ({
    id: student.User.id,
    grade: student.grade,
    name: student.User?.name,
    email: student.User?.email,
  }));

  return result;
});

export type Student = NonNullable<
  ReturnType<typeof getStudents> extends Promise<infer T> ? T : never
>[0];

export default async function EditClass({ params }: EditClassProps) {
  const { teacherId } = params;
  const students = await getStudents(teacherId);
  return (
    <Paper className="w-5/6 mx-auto flex flex-col gap-10 items-center h-screen">
      <h1 className="text-4xl font-bold">Class Name</h1>
      <Separator />
      <ClassForm />
      <StudentTable students={students} />
    </Paper>
  );
}
