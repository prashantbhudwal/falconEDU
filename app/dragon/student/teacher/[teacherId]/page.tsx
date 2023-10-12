import { getChats } from "@/app/(falcon)/chubbi/actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { bots } from "@/app/dragon/test-data";
import { ItemCard } from "../../components/item-card";
import Link from "next/link";
import { getStudentBotURL } from "@/lib/urls";
import {
  getBotsByTeacherId,
  getTeacherDetailsByTeacherId,
  getTeachersByUserId,
} from "../../queries";
import { AvatarNavbar } from "../../components/student-navbar";
import { Separator } from "@/components/ui/separator";

function getBotDescription(type: string) {
  switch (type) {
    case "chat":
      return "Chatbot";
    case "test":
      return "Test";
    default:
      return "Others";
  }
}

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
  const bots = await getBotsByTeacherId(teacherId);
  const teacher = await getTeacherDetailsByTeacherId(teacherId);
  if (!bots) {
    return (
      <>
        <h1>Oops...No bots found. Ask a teacher to assign you a bot.</h1>
      </>
    );
  }
  return (
    <>
      <AvatarNavbar
        title={teacher?.User.name!}
        subtitle={teacher?.User.email!}
        avatarUrl={teacher?.User.image!}
      />
      <div className="pt-1 pb-5 w-full">
        {bots
          .filter((bot) => !bot.isSubmitted)
          .map((bot) => (
            <Link href={getStudentBotURL(bot.id)} key={bot.id}>
              <ItemCard
                title={bot.BotConfig.name!}
                description={getBotDescription(bot.BotConfig.type!)}
              />
            </Link>
          ))}
        <Separator className="my-2" />
        <h1 className="px-4">Submitted</h1>
        <Separator className="my-2" />
        {bots
          .filter((bot) => bot.isSubmitted)
          .map((bot) => (
            <ItemCard
              key={bot.id}
              title={bot.BotConfig.name!}
              description={getBotDescription(bot.BotConfig.type!)}
            />
          ))}
      </div>
    </>
  );
}
