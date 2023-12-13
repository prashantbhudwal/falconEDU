import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@ui/tooltip";
import { getTotalStudentsByClassId } from "./queries";
import EditableClassName from "./components/editable-class-name";
import Link from "next/link";
import { getStudentsURL } from "@/lib/urls";
import { ToggleClassStatusCard } from "./components/toggle-class-status";
import { ConfigCard } from "./components/config-card";
import { Separator } from "@/components/ui/separator";
import { db } from "../../../../routers";
import { getServerSession } from "next-auth";
import { UsersIcon } from "@heroicons/react/24/outline";

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import MyStudentsBtn from "../../../../components/class-sidebar/my-students-btn";
export default async function ClassSettings({
  params,
}: {
  params: { classId: string };
}) {
  const { classId } = params;
  const session = await getServerSession(authOptions);
  if (!session) return null;
  const userId = session?.user?.id;
  const totalStudents = await getTotalStudentsByClassId(classId);
  const configs = await db.botConfig.getAllConfigsInClass({ userId, classId });
  return (
    <div className="w-[80%] mx-auto flex flex-col space-y-10 pt-10">
      {/* ------------------------------------------------------------------------------- */}
      <h1 className="text-3xl font-bold  text-slate-400">Class Dashboard</h1>
      <Separator decorative orientation="horizontal" className="w-full" />
      <EditableClassName classId={classId} />

      {/* ------------------------------------------------------------------------------- */}

      <div className="flex space-x-10">
        <StudentsCard
          classId={classId}
          totalStudents={totalStudents?.length || 0}
        />
        <ToggleClassStatusCard classId={classId} />
      </div>
      <div className="flex justify-start items-center space-x-10">
        <ConfigCard classId={classId} configType="chat" configs={configs} />
        <ConfigCard classId={classId} configType="test" configs={configs} />
      </div>
      {/* ----------------------------------------------------------------------------------- */}
    </div>
  );
}

const StudentsCard = function ({
  classId,
  totalStudents,
}: {
  classId: string;
  totalStudents: number;
}) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={20}>
        <TooltipTrigger asChild>
          <Link
            href={getStudentsURL(classId)}
            className="rounded-md border-border border-[1px] bg-base-200 w-[200px] hover:bg-primary hover:text-base-300"
          >
            <div className="flex items-center justify-center gap-5 p-4 ">
              <div className="flex flex-col items-center text-xs">
                <div className="text-2xl"> {totalStudents}</div>
                <div>Students</div>
              </div>
              <Separator
                decorative
                orientation="vertical"
                className="h-[20px] bg-accent"
              />

              <UsersIcon className="w-7 h-7" />
            </div>
          </Link>
        </TooltipTrigger>
        <TooltipContent
          className="bg-base-200 text-slate-300 text-base "
          sideOffset={10}
        >
          Add students to your class
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
