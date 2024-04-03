import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { StudentHomeNavbar } from "./components/student-navbar";
import { ItemCard } from "./components/item-card";
import Link from "next/link";
import { getStudentTeacherURL } from "@/lib/urls";
import { InstallAppDrawer } from "@/components/install-app-drawer";
import { db } from "../../../lib/routers";
import { CareerCard } from "./components/career-card";

const basePath = "/dragon/student";

export default async function AllChats() {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  if (!id) {
    return null;
  }
  const teachers = await db.student.teacher.getTeachersByUserId(id);
  const { orgBrandName } = await db.org.getStudentBrandNameByUserId({
    userId: id,
  });
  const hasTeachers = teachers.length > 0;

  return (
    <>
      <StudentHomeNavbar brandName={orgBrandName} />
      <div className="w-full pb-5 pt-1">
        {teachers.length === 0 && (
          <div className="flex h-60 flex-col items-center justify-center rounded-md shadow-md">
            <h1 className="mb-2 text-2xl font-semibold text-gray-200">
              🤖 Oops... Nothing here.
            </h1>
            <p className="text-lg text-gray-400">
              Ask a teacher to add you to their class.
            </p>
          </div>
        )}
        <CareerCard />
        {teachers.map((teacher) => (
          <Link href={getStudentTeacherURL(teacher.id)} key={teacher.id}>
            <ItemCard
              imageUrl={teacher.image!}
              title={teacher.name!}
              description={teacher.email!}
            />
          </Link>
        ))}
      </div>
      <InstallAppDrawer />
    </>
  );
}
