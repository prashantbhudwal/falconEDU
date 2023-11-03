import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { getTestEditBotURL } from "@/lib/urls";
import { getFormattedDate } from "@/lib/utils";
import { ItemCardChip, ItemCard } from "../../../components/item-card";
import AddTestForm from "./add-test-form";
import { getBotConfigs } from "../../../queries";
import {
  archiveAllBotsOfBotConfig,
  unArchiveAllBotsOfBotConfig,
  deleteBotConfigAndDeactivateBots,
} from "./mutations";
import { FiArchive, FiCornerRightUp, FiTrash } from "react-icons/fi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TestDashboardProps = {
  params: {
    classId: string;
  };
};

export default async function TestDashboard({ params }: TestDashboardProps) {
  const { classId } = params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User not found");
  }
  const botConfigs = await getBotConfigs(userId, classId, "test");
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
          <AddTestForm classId={classId} />
          <Tabs defaultValue="active">
            <TabsList className="grid w-2/5 grid-cols-2 bg-base-100">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="flex space-y-5 flex-col">
              {activeBots.map((botConfig) => (
                <Link
                  href={getTestEditBotURL(classId, botConfig.id)}
                  key={botConfig.id}
                >
                  <ItemCard
                    title={botConfig.name}
                    actions={[
                      {
                        title: "Archive Test",
                        description:
                          "are you sure you want to archive this test?",
                        name: "Archive Test: Instantly disables the test for all students.",
                        icon: <FiArchive />,
                        action: archiveAllBotsOfBotConfig,
                        actionParams: [botConfig.id],
                      },
                    ]}
                  >
                    <div className="flex flex-row space-x-4">
                      <ItemCardChip
                        className="pl-0"
                        label="Created"
                        value={getFormattedDate(
                          botConfig.createdAt.toDateString()
                        )}
                      />
                      <ItemCardChip
                        label="Status"
                        value={
                          botConfig.published ? "Published" : "Not Published"
                        }
                        valueColor={
                          botConfig.published
                            ? "text-primary"
                            : "text-destructive"
                        }
                      />
                      <ItemCardChip
                        label="Active"
                        value={botConfig.isActive ? "Yes" : "No"}
                        valueColor={
                          botConfig.isActive
                            ? "text-primary"
                            : "text-destructive"
                        }
                      />
                    </div>
                  </ItemCard>
                </Link>
              ))}
            </TabsContent>
            <TabsContent value="archived" className="flex space-y-5 flex-col">
              {archivedBots.map((botConfig) => (
                <Link
                  href={getTestEditBotURL(classId, botConfig.id)}
                  key={botConfig.id}
                >
                  <ItemCard
                    title={botConfig.name}
                    actions={[
                      {
                        title: "Unarchive Test",
                        description:
                          "are you sure you want to unarchive this test?",
                        name: "Activate Test: Instantly activates the test for all students.",
                        icon: <FiCornerRightUp />,
                        action: unArchiveAllBotsOfBotConfig,
                        actionParams: [botConfig.id],
                      },
                      {
                        title: "Delete Test",
                        description:
                          "are you sure you want to delete this test?",
                        name: "DELETE: This will delete the test permanently. The students will still be able to see the test if they have already attempted it.",
                        icon: <FiTrash />,
                        action: deleteBotConfigAndDeactivateBots,
                        actionParams: [botConfig.id],
                      },
                    ]}
                  >
                    <div className="flex flex-row space-x-4">
                      <ItemCardChip
                        label="Created"
                        value={getFormattedDate(
                          botConfig.createdAt.toDateString()
                        )}
                      />
                      <ItemCardChip
                        label="Status"
                        value={
                          botConfig.published ? "Published" : "Not Published"
                        }
                        valueColor={
                          botConfig.published
                            ? "text-primary"
                            : "text-destructive"
                        }
                      />
                      <ItemCardChip
                        label="Active"
                        value={botConfig.isActive ? "Yes" : "No"}
                        valueColor={
                          botConfig.isActive
                            ? "text-primary"
                            : "text-destructive"
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
    </div>
  );
}
