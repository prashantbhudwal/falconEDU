import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Paper } from "@/components/ui/paper";
import TaskList from "./components/task-list";
import { db } from "../../../routers";
import { BotConfig, Class } from "@prisma/client";

type BotConfigWithClass = BotConfig & { Class: Class };

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
  // const classesWithConfigs = await db.class.getClassesByUserId({ userId });
  // const nameOfClass = await db.class.getClassNameByClassId(classId);
  const classConfigs = await db.botConfig.getAllConfigsInClass({
    userId,
    classId,
  });
  const activeConfigs = classConfigs.active;
  const archivedConfigs = classConfigs.archived;

  return (
    <Paper className="h-full flex flex-col items-center w-5/6 overflow-y-auto custom-scrollbar justify-between">
      <div className="w-8/12 max-w-6xl flex flex-col space-y-6">
        <TaskList
          tasks={[...activeConfigs, ...archivedConfigs] as BotConfigWithClass[]}
          classId={classId}
          userId={userId}
        />
        {/* {archivedConfigs.length > 0 && (
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
                  <TaskList
                    tasks={archivedConfigs}
                    classId={classId}
                    userId={userId}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )} */}
      </div>
    </Paper>
  );
}
