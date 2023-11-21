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
import ClassStatus from "./components/class-status";
import TotalBotConfigCount from "./components/total-botconfig-count";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/24/solid";

export default async function ClassSettings({
  params,
}: {
  params: { classId: string };
}) {
  const { classId } = params;
  const totalStudents = await getTotalStudentsByClassId(classId);
  const publishedTest = await getTotalPublishedTestsByClassId(classId);
  const unpublishedTest = await getTotalUnPublishedTestsByClassId(classId);
  const publishedBot = await getTotalPublishedBotsByClassId(classId);
  const unpublishedBot = await getTotalUnpublishedBotsByClassId(classId);

  return (
    <div className="w-[80%] mx-auto my-10 flex flex-col">
      {/* ------------------------------------------------------------------------------- */}

      <div className="flex justify-between items-center">
        <EditableClassName classId={classId} />
        <div className="flex items-center gap-5 p-4 rounded-xl bg-base-100">
          <div className="flex flex-col items-center text-xs">
            <div className="text-2xl">
              {" "}
              {totalStudents ? totalStudents?.length : 0}
            </div>
            <div>Students</div>
          </div>
          <Separator
            decorative
            orientation="vertical"
            className="h-[20px] bg-secondary"
          />

          <Link href={getStudentsURL(classId)}>
            <Button variant={"outline"} size={"icon"}>
              <PlusIcon className="w-10 h-10" />
            </Button>
          </Link>
        </div>
      </div>
      {/* <ClassStatus classId={classId} /> */}

      <TotalBotConfigCount
        classId={classId}
        publishedTest={publishedTest}
        unpublishedTest={unpublishedTest}
        configType="test"
      />

      {/* ----------------------------------------------------------------------------------- */}

      <TotalBotConfigCount
        classId={classId}
        publishedBot={publishedBot}
        unpublishedBot={unpublishedBot}
        configType="bots"
      />

      {/* ----------------------------------------------------------------------------------- */}
    </div>
  );
}
