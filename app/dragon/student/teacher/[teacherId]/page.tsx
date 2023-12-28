import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { AvatarNavbar } from "../../components/student-navbar";
import { ChatCard } from "../../components/chat-card";
import { db } from "@/app/dragon/teacher/routers";

export default async function TeacherDashboard({
  params,
}: {
  params: { teacherId: string };
}) {
  const { teacherId } = params;
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  if (!id) {
    return null;
  }
  const bots = await db.bot.getBotsByTeacherAndStudentID(teacherId, id);
  const teacher = await db.profile.getTeacherDetailsByTeacherId(teacherId);
  if (!bots) {
    return (
      <>
        <h1>Oops...No bots found. Ask a teacher to assign you a bot.</h1>
      </>
    );
  }
  const sortedBots = bots.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  return (
    <div>
      <AvatarNavbar
        title={teacher?.User.name!}
        subtitle={teacher?.User.email!}
        avatarUrl={teacher?.User.image!}
      />
      <div className="pt-1 pb-20 w-full overflow-y-auto h-screen custom-scrollbar flex flex-col">
        {sortedBots.map(async (bot) => (
          <ChatCard key={bot.id} bot={bot} />
        ))}
      </div>
    </div>
  );
}
