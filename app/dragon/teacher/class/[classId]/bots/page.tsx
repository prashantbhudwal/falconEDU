import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { NewBotCard } from "../../../components/new-bot-card";
import { prisma } from "@/prisma";
import { cache } from "react";
import Link from "next/link";
import { getEditBotURL } from "@/lib/urls";
import { getFormattedDate } from "@/lib/utils";
import { ItemCardChip, ItemCard } from "../../../components/item-card";

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
    <div className="w-full">
      <div className="flex space-y-5 flex-col w-full">
        <NewBotCard classId={classId} />
        {botConfigs.map((bot) => (
          <Link href={getEditBotURL(classId, bot.id)} key={bot.id}>
            <ItemCard title={bot.name}>
              <div className="flex flex-row space-x-4">
                <ItemCardChip
                  label="Created"
                  value={getFormattedDate(bot.createdAt.toDateString())}
                />
                <ItemCardChip
                  label="Status"
                  value={bot.published ? "Published" : "Not Published"}
                  valueColor={
                    bot.published ? "text-primary" : "text-destructive"
                  }
                />
              </div>
            </ItemCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
