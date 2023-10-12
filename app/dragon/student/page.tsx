import { getChats } from "@/app/(falcon)/chubbi/actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { bots } from "@/app/dragon/test-data";
import { getBotsByUserId } from "./queries";
import { StudentHomeNavbar } from "./components/student-navbar";
import { ItemCard } from "./components/item-card";
import Link from "next/link";
import { getStudentBotURL } from "@/lib/urls";
import { getTeachersByUserId } from "./queries";

const basePath = "/dragon/student";

export default async function AllChats() {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  if (!id) {
    return null;
  }
  const teachers = await getTeachersByUserId(id);
  if (!teachers) {
    return (
      <>
        <h1>Oops...No bots found. Ask a teacher to assign you a bot.</h1>
      </>
    );
  }
  return (
    <>
      <StudentHomeNavbar />
      <div className="pt-1 pb-5 w-full">
        {teachers.map((teacher) => (
          <Link href={""} key={teacher.id}>
            <ItemCard
              imageUrl={teacher.image!}
              title={teacher.name!}
              description={teacher.email!}
            />
          </Link>
        ))}
      </div>
    </>
  );
}
