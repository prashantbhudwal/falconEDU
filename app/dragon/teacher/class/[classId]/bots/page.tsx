import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { getEditBotURL } from "@/lib/urls";
import { getFormattedDate } from "@/lib/utils";
import { ItemCardChip, ItemCard } from "../../../components/item-card";
import AddBotForm from "./add-bot-form";
import { getBotConfigs } from "../../../queries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FiArchive, FiCornerRightUp, FiTrash } from "react-icons/fi";
import {
  archiveAllBotsOfBotConfig,
  unArchiveAllBotsOfBotConfig,
  deleteBotConfigAndDeactivateBots,
} from "./mutations";

type BotDashboardProps = {
  params: {
    classId: string;
  };
};

export default async function Dashboard({ params }: BotDashboardProps) {
  const { classId } = params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not found");
  }
  const botConfigs = await getBotConfigs(userId, classId, "chat");
  const activeBots = botConfigs
    .filter((botConfig) => botConfig.isActive)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const archivedBots = botConfigs
    .filter((botConfig) => !botConfig.isActive)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="w-full overflow-y-scroll custom-scrollbar ">
      <div className="p-10 h-full">
        <div className="flex space-y-5 flex-col w-full">
          <AddBotForm classId={classId} />
          <Tabs defaultValue="active">
            <TabsList className="grid w-2/5 grid-cols-2 bg-base-100">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="flex space-y-5 flex-col">
              {activeBots.length === 0 ? (
                <p>There are currently no active bots.</p>
              ) : (
                activeBots.map((bot) => (
                  <Link href={getEditBotURL(classId, bot.id)} key={bot.id}>
                    <ItemCard
                      title={bot.name}
                      actions={[
                        {
                          title: "Archive Bot",
                          description:
                            "are you sure you want to archive this bot?",
                          name: "Archive Bot: Instantly disables the bot for all students.",
                          icon: <FiArchive />,
                          action: archiveAllBotsOfBotConfig,
                          actionParams: [bot.id],
                        },
                      ]}
                    >
                      <div className="flex flex-row space-x-4">
                        <ItemCardChip
                          className="pl-0"
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
                        <ItemCardChip
                          label="Active"
                          value={bot.isActive ? "Yes" : "No"}
                          valueColor={
                            bot.isActive ? "text-primary" : "text-destructive"
                          }
                        />
                      </div>
                    </ItemCard>
                  </Link>
                ))
              )}
            </TabsContent>
            <TabsContent value="archived" className="flex space-y-5 flex-col">
              {archivedBots.length === 0 ? (
                <p>There are currently no Archived bots.</p>
              ) : (
                archivedBots.map((bot) => (
                  <Link href={getEditBotURL(classId, bot.id)} key={bot.id}>
                    <ItemCard
                      title={bot.name}
                      actions={[
                        {
                          title: "Unarchive Bot",
                          description:
                            "are you sure you want to unarchive this bot?",
                          name: "Activate Bot: Instantly activates the bot for all students.",
                          icon: <FiCornerRightUp />,
                          action: unArchiveAllBotsOfBotConfig,
                          actionParams: [bot.id],
                        },
                        {
                          title: "Delete Bot",
                          description:
                            "are you sure you want to delete this bot?",
                          name: "DELETE: This will delete the bot permanently. The students will still be able to see the bot if they have already attempted it.",
                          icon: <FiTrash />,
                          action: deleteBotConfigAndDeactivateBots,
                          actionParams: [bot.id],
                        },
                      ]}
                    >
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
                        <ItemCardChip
                          label="Active"
                          value={bot.isActive ? "Yes" : "No"}
                          valueColor={
                            bot.isActive ? "text-primary" : "text-destructive"
                          }
                        />
                      </div>
                    </ItemCard>
                  </Link>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
