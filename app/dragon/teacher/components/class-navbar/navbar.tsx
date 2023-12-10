import DragonHomeBtn from "@/components/navbar/dragon-home-btn";
import { ImportModal } from "./import-modal";
import { db } from "../../routers";
import type { ClassesByUserId } from "../../routers/classRouter";

export async function ClassNavbar({
  classId,
  userId,
  classesWithConfigs,
}: {
  classId: string;
  userId: string;
  classesWithConfigs: ClassesByUserId;
}) {
  return (
    <div className="flex items-center justify-between h-12 bg-base-200 shadow-sm shadow-base-100 w-full">
      <div className="flex-none gap-4 pr-2 pl-6">
        <DragonHomeBtn />
      </div>
      <div className="flex-grow"></div>
      <div className="flex-none gap-3 pr-1">
        <ImportModal
          classId={classId}
          userId={userId}
          classesWithConfigs={classesWithConfigs}
        />
      </div>
    </div>
  );
}
