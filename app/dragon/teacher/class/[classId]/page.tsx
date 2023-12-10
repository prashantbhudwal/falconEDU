import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { NewTaskCard } from "./tasks/components/new-task-card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { getBotsURL, getSettingsUrl } from "@/lib/urls";
import Avvvatars from "avvvatars-react";
import { TaskCard } from "./tasks/components/task-card";
import { Paper } from "@/components/ui/paper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { db } from "../../routers";

export default async function Classes({
  params,
}: {
  params: { classId: string };
}) {
  const { classId } = params;
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return null;
  }
  const classesWithConfigs = await db.class.getClassesByUserId({ userId });
  const classConfigs = await db.botConfig.getAllConfigsInClass({
    userId,
    classId,
  });

  const allConfigs = classConfigs.all;
  const activeConfigs = classConfigs.active;
  const archivedConfigs = classConfigs.archived;
  const activeBots = classConfigs.chat.active;
  const archivedBots = classConfigs.chat.archived;
  const activeTests = classConfigs.test.active;
  const archivedTests = classConfigs.test.archived;

  return (
    <Paper className="h-full w-full overflow-y-auto custom-scrollbar bg-base-300 flex flex-col justify-between space-y-6">
      <div className="flex flex-row gap-10 flex-wrap">
        <NewTaskCard />
        {activeConfigs.map((config) => (
          <Link href={getSettingsUrl(config.id)} key={config.id}>
            <TaskCard
              className="rounded-lg"
              icon={<Avvvatars value={config.id} style="shape" size={80} />}
              name={config.name}
            />
          </Link>
        ))}
      </div>
      {archivedConfigs.length > 0 && (
        <div className=" flex flex-col gap-4">
          <Accordion
            type="single"
            collapsible
            className="rounded-lg ring-base-200 ring-1"
          >
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="text-slate-500 text-xl font-bold hover:no-underline bg-base-200 px-2 ">
                Archived
              </AccordionTrigger>
              <AccordionContent className="border-none px-2 py-4">
                <div className="flex flex-row gap-10">
                  {archivedConfigs.map((config) => (
                    <Link href={getSettingsUrl(config.id)} key={config.id}>
                      <TaskCard
                        className="rounded-lg"
                        icon={
                          <div className="text-base-100">
                            <Avvvatars
                              value={config.id}
                              style="shape"
                              size={80}
                            />
                          </div>
                        }
                        name={config.name}
                      />
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </Paper>
  );
}
