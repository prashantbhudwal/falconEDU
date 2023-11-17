import { DeleteDialog } from "../../../components/delete-dialog";
import { deleteClassByClassId } from "../../../mutations";
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
    <div className="w-[80%] mx-auto my-10">
      {/* ------------------------------------------------------------------------------- */}

      <div className="flex justify-between items-center">
        <EditableClassName classId={classId} />
        <ClassStatus classId={classId} />
      </div>

      {/* ------------------------------------------------------------------------------- */}

      <div className="my-10 flex flex-col items-start text-lg">
        <span className="tracking-wide">
          Total Number of students in your class :{" "}
          <span className="text-white font-semibold text-xl">
            {totalStudents ? totalStudents?.length : 0}
          </span>
        </span>
        <p className="flex gap-1 text-[10px] tracking-wide items-center">
          <InformationCircleIcon className="w-3 h-3" />
          Class students gain automatic access to all class Bots and Tests
        </p>
        <Link
          href={getStudentsURL(classId)}
          className="px-4 py-2 rounded-lg bg-accent text-xs font-semibold text-accent-content"
        >
          Manage Students
        </Link>
      </div>

      {/* ----------------------------------------------------------------------------------- */}

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
