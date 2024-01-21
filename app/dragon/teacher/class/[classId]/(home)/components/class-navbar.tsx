import DragonHomeBtn from "@/components/navbar/dragon-home-btn";
import { ImportModal } from "./import-modal";
import { db } from "../../../../../../../lib/routers";
import type { ClassesByUserId } from "../../../../../../../lib/routers/classRouter";
import { NewTaskModal } from "./new-task-modal";
import MyStudentsBtn from "../../../../components/class-sidebar/my-students-btn";
import { Button } from "@/components/ui/button";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/solid";
import { getSettingsUrl } from "@/lib/urls";
import Link from "next/link";
import { Grade } from "@prisma/client";
import { Class } from "@prisma/client";
import { getFormattedGrade } from "@/app/dragon/teacher/utils";
import { EditClassModal } from "../../(settings)/dashboard/components/edit-class-modal";

export async function ClassNavbar({
  classId,
  userId,
  classesWithConfigs,
  grade,
  section,
}: {
  classId: string;
  userId: string;
  classesWithConfigs: ClassesByUserId;
  grade: Grade;
  section: Class["section"];
}) {
  const classDetails = await db.class.getClassByClassId({ classId });
  return (
    <div className="navbar flex w-full border-b border-base-200 bg-base-300">
      <div className="navbar-start flex gap-4 pl-6 pr-2">
        <DragonHomeBtn />
        <MyStudentsBtn classId={classId} />
      </div>

      <div className="navbar-center space-x-2 font-semibold text-secondary/70">
        <div>
          {`${getFormattedGrade({ grade })}` + (section ? ` - ${section}` : ``)}
        </div>
        <EditClassModal initialValues={classDetails} />
      </div>
      <div className="navbar-end flex gap-2 pr-1">
        {classDetails?.isActive && (
          <>
            <NewTaskModal classId={classId} userId={userId} />
            <ImportModal
              classId={classId}
              userId={userId}
              classesWithConfigs={classesWithConfigs}
            />
          </>
        )}
        <Link href={getSettingsUrl(classId)}>
          <Button variant="ghost" size="icon">
            <WrenchScrewdriverIcon className="w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
