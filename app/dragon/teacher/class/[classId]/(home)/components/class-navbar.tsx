import DragonHomeBtn from "@/components/navbar/dragon-home-btn";
import { ImportModal } from "./import-modal";
import { db } from "../../../../routers";
import type { ClassesByUserId } from "../../../../routers/classRouter";
import { NewTaskModal } from "./new-task-modal";
import MyStudentsBtn from "../../../../components/class-sidebar/my-students-btn";
import { Button } from "@/components/ui/button";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/solid";
import { getSettingsUrl } from "@/lib/urls";
import Link from "next/link";
import { Grade } from "@prisma/client";
import { Class } from "@prisma/client";
import { getFormattedGrade } from "@/app/dragon/teacher/utils";

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
    <div className="navbar flex w-full bg-base-300 border-b border-base-200">
      <div className="navbar-start gap-4 pr-2 pl-6 flex">
        <DragonHomeBtn />
        <MyStudentsBtn classId={classId} />
      </div>
      <div className="navbar-center text-secondary/70 font-semibold">
        {`${getFormattedGrade({ grade })}` + (section ? ` - ${section}` : ``)}
      </div>
      <div className="navbar-end pr-1 flex gap-2">
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
