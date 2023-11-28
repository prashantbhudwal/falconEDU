import { type BotConfigs } from "@/app/dragon/teacher/queries";
import AddTestForm from "./add-test-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { getTestEditBotURL } from "@/lib/urls";
import {
  ItemCard,
  ItemCardChip,
} from "@/app/dragon/teacher/components/item-card";
import { FiArchive, FiCornerRightUp, FiTrash } from "react-icons/fi";
import { getFormattedDate } from "@/lib/utils";
import { db } from "@/app/dragon/teacher/routers";

export async function TestList({
  testConfigs,
  classId,
}: {
  testConfigs: BotConfigs;
  classId: string;
}) {
  const activeTests = testConfigs
    .filter((testConfig) => testConfig.isActive)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const archivedTests = testConfigs
    .filter((testConfig) => !testConfig.isActive)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="flex space-y-5 flex-col w-full">
      <AddTestForm classId={classId} />
      <Tabs defaultValue="active">
        <TabsList className="grid w-2/5 grid-cols-2 bg-base-100">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="flex space-y-5 flex-col">
          {activeTests.map((botConfig) => (
            <Link
              href={getTestEditBotURL(classId, botConfig.id)}
              key={botConfig.id}
            >
              <ItemCard
                title={botConfig.name}
                actions={[
                  {
                    title: "Archive Test",
                    description: "are you sure you want to archive this test?",
                    name: "Archive Test: Instantly disables the test for all students.",
                    icon: <FiArchive />,
                    action: db.bot.archiveAllBotsOfBotConfig,
                    actionParams: [botConfig.id],
                  },
                ]}
              >
                <div className="flex flex-row space-x-4">
                  <ItemCardChip
                    label="Created"
                    value={getFormattedDate(botConfig.createdAt.toDateString())}
                  />
                  <ItemCardChip
                    label="Status"
                    value={botConfig.published ? "Published" : "Not Published"}
                    valueColor={
                      botConfig.published ? "text-primary" : "text-destructive"
                    }
                  />
                  <ItemCardChip
                    label="Active"
                    value={botConfig.isActive ? "Yes" : "No"}
                    valueColor={
                      botConfig.isActive ? "text-primary" : "text-destructive"
                    }
                  />
                </div>
              </ItemCard>
            </Link>
          ))}
        </TabsContent>
        <TabsContent value="archived" className="flex space-y-5 flex-col">
          {archivedTests.map((botConfig) => (
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
                    action: db.bot.unArchiveAllBotsOfBotConfig,
                    actionParams: [botConfig.id],
                  },
                  {
                    title: "Delete Test",
                    description: "are you sure you want to delete this test?",
                    name: "DELETE: This will delete the test permanently. The students will still be able to see the test if they have already attempted it.",
                    icon: <FiTrash />,
                    action: db.bot.deleteBotConfigAndDeactivateBots,
                    actionParams: [botConfig.id],
                  },
                ]}
              >
                <div className="flex flex-row space-x-4">
                  <ItemCardChip
                    label="Created"
                    value={getFormattedDate(botConfig.createdAt.toDateString())}
                  />
                  <ItemCardChip
                    label="Status"
                    value={botConfig.published ? "Published" : "Not Published"}
                    valueColor={
                      botConfig.published ? "text-primary" : "text-destructive"
                    }
                  />
                  <ItemCardChip
                    label="Active"
                    value={botConfig.isActive ? "Yes" : "No"}
                    valueColor={
                      botConfig.isActive ? "text-primary" : "text-destructive"
                    }
                  />
                </div>
              </ItemCard>
            </Link>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
