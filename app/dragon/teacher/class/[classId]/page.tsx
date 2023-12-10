import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Paper } from "@/components/ui/paper";
import TaskList from "./tasks/components/task-list";
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
  const activeConfigs = classConfigs.active;
  const archivedConfigs = classConfigs.archived;
  return (
    <Paper className="h-full w-full overflow-y-auto custom-scrollbar bg-base-300 flex flex-col justify-between space-y-6">
      <div className="flex flex-col space-y-4">
        <TaskList tasks={activeConfigs} classId={classId} userId={userId} />
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
                <div className="flex flex-col gap-10">
                  <TaskList
                    tasks={archivedConfigs}
                    classId={classId}
                    userId={userId}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </Paper>
  );
}
