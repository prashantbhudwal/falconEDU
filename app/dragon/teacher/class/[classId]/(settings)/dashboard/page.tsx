import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@ui/tooltip";
import Link from "next/link";
import { getStudentsURL } from "@/lib/urls";
import { ToggleClassStatusCard } from "./components/toggle-class-status";
import { ConfigCard } from "./components/config-card";
import { Separator } from "@/components/ui/separator";
import { db } from "../../../../../../../lib/routers";
import { getServerSession } from "next-auth";
import { UsersIcon } from "@heroicons/react/24/outline";

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import MyStudentsBtn from "../../../../components/class-sidebar/my-students-btn";
import { ClassPreferencesForm } from "./components/class-preferences-form";
export default async function ClassSettings({
  params,
}: {
  params: { classId: string };
}) {
  const { classId } = params;
  const session = await getServerSession(authOptions);
  if (!session) return null;
  const userId = session?.user?.id;
  const totalStudents = await db.class.getTotalStudentsByClassId(classId);
  const configs = await db.botConfig.getAllConfigsInClass({ userId, classId });
  const classDetails = await db.class.getClassByClassId({ classId });
  return (
    <div className=" mx-auto flex flex-col items-center space-y-10 pt-10">
      {/* ------------------------------------------------------------------------------- */}
      <h1 className="text-3xl font-bold  text-slate-400">Class Settings</h1>

      {/* ------------------------------------------------------------------------------- */}
      <div className="flex flex-col space-y-10">
        <ClassPreferencesForm initialValues={classDetails} />
        <Separator
          decorative
          orientation="horizontal"
          className="w-full bg-slate-600"
        />

        <div className="flex space-x-10">
          <StudentsCard
            classId={classId}
            totalStudents={totalStudents?.length || 0}
          />
          <ToggleClassStatusCard classId={classId} />
        </div>
        <div className="flex items-center justify-start space-x-10">
          <ConfigCard
            classId={classId}
            configType="chat"
            configs={configs}
            showActions={classDetails.isActive as boolean}
          />
          <ConfigCard
            classId={classId}
            configType="test"
            configs={configs}
            showActions={classDetails.isActive as boolean}
          />
        </div>
        {/* ----------------------------------------------------------------------------------- */}
      </div>
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
            className="w-[200px] rounded-md border-[1px] border-border bg-base-200 hover:bg-primary hover:text-base-300"
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

              <UsersIcon className="h-7 w-7" />
            </div>
          </Link>
        </TooltipTrigger>
        <TooltipContent
          className="bg-base-200 text-base text-slate-300 "
          sideOffset={10}
        >
          Add students to your class
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
