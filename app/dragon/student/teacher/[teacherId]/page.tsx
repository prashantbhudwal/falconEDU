import { getChats } from "@/app/(falcon)/chubbi/actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { bots } from "@/app/dragon/test-data";
import { ItemCard } from "../../components/item-card";
import Link from "next/link";
import { getStudentBotURL } from "@/lib/urls";
import { getBotsByTeacherId } from "../../queries";

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
  if (!bots) {
    return (
      <>
        <h1>Oops...No bots found. Ask a teacher to assign you a bot.</h1>
      </>
    );
  }
  return (
    <>
      <div className="pt-1 pb-5 w-full">
        {bots.map((bot) => (
          <Link href={getStudentBotURL(bot.id)} key={bot.id}>
            <ItemCard
              title={bot.BotConfig.name!}
              description={getBotDescription(bot.BotConfig.type!)}
            />
          </Link>
        ))}
      </div>
    </>
  );
}
