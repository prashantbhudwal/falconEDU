import ChubbiDropdown from "@/components/navbar/chubbi-dropdown";
import ProfileDropDown from "@/components/navbar/profile-dropdown";
import HelpDropdown from "@/components/navbar/help-dropdown";
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
    <div className="navbar h-2 bg-base-200 shadow-sm shadow-base-100">
      <div className="navbar-start gap-4 pr-2">
        <ChubbiDropdown />
        <DragonHomeBtn />
      </div>
      <div className="navbar-center"></div>
      <div className="navbar-end gap-3 pr-1">
        <ImportModal
          classId={classId}
          userId={userId}
          classesWithConfigs={classesWithConfigs}
        />
        <ProfileDropDown url={"/profile/teacher"} />
      </div>
    </div>
  );
}
