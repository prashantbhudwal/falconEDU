import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { getEditBotURL } from "@/lib/urls";
import { getFormattedDate } from "@/lib/utils";
import { ItemCardChip, ItemCard } from "../../../components/item-card";
import AddBotForm from "./add-bot-form";
import { getBotConfigs } from "../../../queries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  return (
    <div className="w-full">
      <div className="flex space-y-5 flex-col w-full">
        <AddBotForm classId={classId} />
        <Tabs defaultValue="active">
          <TabsList className="grid w-2/5 grid-cols-2 bg-base-100">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="flex space-y-5 flex-col">
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
          </TabsContent>
          <TabsContent value="archived" className="flex space-y-5 flex-col">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
