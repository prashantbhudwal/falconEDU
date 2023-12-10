import DragonHomeBtn from "@/components/navbar/dragon-home-btn";
import { ImportModal } from "./import-modal";
import { db } from "../../../../routers";
import type { ClassesByUserId } from "../../../../routers/classRouter";
import { NewTaskModal } from "./new-task-modal";
import MyStudentsBtn from "../../../../components/class-sidebar/my-students-btn";
import { Button } from "@/components/ui/button";
import { MdDashboard } from "react-icons/md";
import { getSettingsUrl } from "@/lib/urls";
import Link from "next/link";

export async function ClassNavbar({
  classId,
  userId,
  classesWithConfigs,
  name,
}: {
  classId: string;
  userId: string;
  classesWithConfigs: ClassesByUserId;
  name: string;
}) {
  return (
    <div className="navbar flex w-full bg-base-300 border-b border-base-200">
      <div className="navbar-start gap-4 pr-2 pl-6 flex">
        <DragonHomeBtn />
        <MyStudentsBtn classId={classId} />
      </div>
      <div className="navbar-center">{name}</div>
      <div className="navbar-end pr-1 flex gap-2">
        <NewTaskModal classId={classId} userId={userId} />
        <ImportModal
          classId={classId}
          userId={userId}
          classesWithConfigs={classesWithConfigs}
        />
        <Link href={getSettingsUrl(classId)}>
          <Button variant="ghost" size="icon">
            <MdDashboard className="w-6" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
