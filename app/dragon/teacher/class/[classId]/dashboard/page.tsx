import {
  getTotalPublishedBotsByClassId,
  getTotalPublishedTestsByClassId,
  getTotalStudentsByClassId,
  getTotalUnPublishedTestsByClassId,
  getTotalUnpublishedBotsByClassId,
} from "./queries";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import EditableClassName from "./components/editable-class-name";
import Link from "next/link";
import { getStudentsURL } from "@/lib/urls";
import { ToggleClassStatusCard } from "./components/toggle-class-status";
import { ConfigCard } from "./components/config-card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/24/solid";
import { db } from "../../../routers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
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
    <div className="w-[80%] mx-auto my-10 flex flex-col space-y-10">
      {/* ------------------------------------------------------------------------------- */}
      <EditableClassName classId={classId} />
      {/* ------------------------------------------------------------------------------- */}
      <Separator decorative orientation="horizontal" className="w-full" />
      <div className="flex justify-start items-center space-x-10">
        <ConfigCard classId={classId} configType="chat" configs={configs} />
        <ConfigCard classId={classId} configType="test" configs={configs} />
      </div>
      <div className="flex space-x-10">
        <StudentsCard
          classId={classId}
          totalStudents={totalStudents?.length || 0}
        />
        <ToggleClassStatusCard classId={classId} />
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
    <div className="flex items-center justify-center gap-5 p-4 rounded-md border-border border-[1px] bg-base-200 w-[200px]">
      <div className="flex flex-col items-center text-xs">
        <div className="text-2xl"> {totalStudents}</div>
        <div>Students</div>
      </div>
      <Separator
        decorative
        orientation="vertical"
        className="h-[20px] bg-accent"
      />

      <Link href={getStudentsURL(classId)}>
        <Button variant={"outline"} size={"icon"} className="border-none">
          <PlusIcon className="w-10 h-10" />
        </Button>
      </Link>
    </div>
  );
};
