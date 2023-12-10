import DragonHomeBtn from "@/components/navbar/dragon-home-btn";
import { ImportModal } from "./import-modal";
import { db } from "../../routers";
import type { ClassesByUserId } from "../../routers/classRouter";
import { NewTaskModal } from "../../class/[classId]/tasks/components/new-task-modal";

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
        <NewTaskModal classId={classId} userId={userId} />
      </div>
      <div className="navbar-center">{name}</div>
      <div className="navbar-end pr-1">
        <ImportModal
          classId={classId}
          userId={userId}
          classesWithConfigs={classesWithConfigs}
        />
      </div>
    </div>
  );
}
