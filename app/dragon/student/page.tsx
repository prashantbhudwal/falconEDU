import { getChats } from "@/app/(engines)/chubbi/actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { bots } from "@/app/dragon/test-data";
import { getBotsByUserId } from "./queries";
import { StudentHomeNavbar } from "./components/student-navbar";
import { ItemCard } from "./components/item-card";
import Link from "next/link";
import { getStudentBotURL, getStudentTeacherURL } from "@/lib/urls";
import { getTeachersByUserId } from "./queries";
import { InstallAppDrawer } from "@/components/install-app-drawer";
import { db } from "../teacher/routers";

const basePath = "/dragon/student";

export default async function AllChats() {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  if (!id) {
    return null;
  }
  const teachers = await getTeachersByUserId(id);
  const { orgBrandName } = await db.org.getStudentBrandNameByUserId({
    userId: id,
  });

  return (
    <>
      <StudentHomeNavbar brandName={orgBrandName} />
      <div className="pt-1 pb-5 w-full">
        {teachers.length === 0 && (
          <div className="flex flex-col justify-center items-center h-60 rounded-md shadow-md">
            <h1 className="text-gray-200 text-2xl font-semibold mb-2">
              🤖 Oops... Nothing here.
            </h1>
            <p className="text-gray-400 text-lg">
              Ask a teacher to add you to their class.
            </p>
          </div>
        )}
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
