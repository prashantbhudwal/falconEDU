import { getBots } from "../actions";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { NewBotCard } from "../../../components/new-bot-card";
import { prisma } from "@/prisma";
import { cache } from "react";
import { getTeacherId } from "../../../utils";
import Link from "next/link";
import { getEditBotURL } from "@/lib/urls";
import IconCard from "../../../components/icon-card";
import Avvvatars from "avvvatars-react";

type BotDashboardProps = {
  params: {
    classId: string;
  };
};
const getBotConfigs = cache(async (userId: string, classId: string) => {
  const teacherProfile = await prisma.teacherProfile.findUnique({
    where: { userId },
  });

  if (!teacherProfile) {
    throw new Error(`TeacherProfile with userId ${userId} not found`);
  }
  const botConfigs = await prisma.botConfig.findMany({
    where: {
      teacherId: teacherProfile.id,
      classId,
    },
  });
  return botConfigs;
});

export default async function Dashboard({ params }: BotDashboardProps) {
  const { classId } = params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not found");
  }
  const botConfigs = await getBotConfigs(userId, classId);
  return (
    <div className="flex  w-full">
      <div className="flex gap-3 flex-wrap">
        <NewBotCard classId={classId} />
        {botConfigs.map((bot) => (
          <Link href={getEditBotURL(classId, bot.id)} key={bot.id}>
            <IconCard
              className=""
              icon={<Avvvatars value={bot.id} style="shape" />}
              text={bot.name}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
